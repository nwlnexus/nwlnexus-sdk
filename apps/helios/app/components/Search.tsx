import { Input } from 'react-daisyui';

export default function Search() {
  return (
    <>
      <div className="hidden w-full max-w-sm lg:flex">
        <Input
          className="searchbox relative mx-3 w-full"
          placeholder="Search..."
          size="md"
          color="neutral"
          bordered={false}
        />
      </div>
    </>
  );
}
