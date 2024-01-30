import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeSvelte } from '@huntabyte/mdsvex';
import { toHtml } from 'hast-util-to-html';
import rehypePrettyCode from 'rehype-pretty-code';
import { codeImport } from 'remark-code-import';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shikiji';
import { visit } from 'unist-util-visit';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = { type: 'text', value: ' ' };
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = ['line--highlighted'];
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['word--highlighted'];
  },
  getHighlighter: options => {
    return getHighlighter({
      ...options
    });
  }
};

/** @type {import('mdsvex').MdsvexOptions} */
export const mdsvexOptions = {
  extensions: ['.md', '.svx'],
  layout: resolve(__dirname, './src/docs/layout.svelte'),
  smartypants: {
    quotes: true,
    ellipses: true,
    backticks: true,
    dashes: true
  },
  remarkPlugins: [remarkGfm, remarkEscapeSvelte, codeImport],
  rehypePlugins: [
    rehypeComponentPreToPre,
    [rehypePrettyCode, prettyCodeOptions],
    rehypeHandleMetadata,
    rehypeRenderCode,
    rehypePreToComponentPre
  ]
};

function rehypeComponentPreToPre() {
  return async tree => {
    // Replace `Component.pre` tags with regular `pre` tags.
    // This enables us to use rehype-pretty-code with our custom `pre` component.
    visit(tree, node => {
      if (node?.type === 'element' && node?.tagName === 'Components.pre') {
        node.tagName = 'pre';
      }
    });
  };
}

const entities = [
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/{/g, '&#123;'],
  [/}/g, '&#125;']
];

function remarkEscapeSvelte() {
  return async tree => {
    visit(tree, 'inlineCode', escape);

    function escape(node) {
      for (let i = 0; i < entities.length; i += 1) {
        node.value = node.value.replace(entities[i][0], entities[i][1]);
      }
    }
  };
}

function rehypePreToComponentPre() {
  return async tree => {
    // Replace `pre` tags with our custom `Component.pre` tags.
    // This enables us to use rehype-pretty-code with our custom `pre` component.
    visit(tree, node => {
      if (node?.type === 'element' && node?.tagName === 'pre') {
        node.tagName = 'Components.pre';
      }
    });
  };
}

function rehypeHandleMetadata() {
  return async tree => {
    visit(tree, node => {
      if (node?.type === 'element' && node?.tagName === 'div') {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return;
        }

        const preElement = node.children.at(-1);
        if (preElement.tagName !== 'pre') {
          return;
        }

        if (node.children.at(0).tagName === 'div') {
          node.properties['data-metadata'] = '';
        }
      }
    });
  };
}

function rehypeRenderCode() {
  return async tree => {
    let counter = 0;
    visit(tree, node => {
      if (node?.type === 'element' && (node?.tagName === 'Components.pre' || node?.tagName === 'pre')) {
        counter++;

        const isNonPP = counter % 2 === 0;
        if (isNonPP) {
          node.properties = {
            ...node.properties,
            'data-non-pp': ''
          };
        }

        /** @type HTMLElement */
        const codeEl = node.children[0];
        if (codeEl.tagName !== 'code') {
          return;
        }

        const meltString = tabsToSpaces(
          toHtml(codeEl, {
            allowDangerousCharacters: true,
            allowDangerousHtml: true
          })
        );

        codeEl.type = 'raw';
        codeEl.value = `{@html \`${escapeSvelte(meltString)}\`}`;
      }
    });
  };
}

function tabsToSpaces(code) {
  return code.replaceAll('    ', '  ').replaceAll('\t', '  ');
}
