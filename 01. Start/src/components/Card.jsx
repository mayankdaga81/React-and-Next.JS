import Button from "./Button";

function Card({ title = "Card Title" }) {
  return (
    <>
      <div className="max-w-sm bg-white border border-gray-200 rounded-xl mt-8 shadow overflow-hidden transition-shadow ">
        <img
          className="w-full h-48 object-cover"
          src="https://images.unsplash.com/photo-1761839257046-84e95464cc52"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 ">{title}</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus,
            aperiam cum? Dignissimos quod eaque, velit, temporibus dolorem
            laboriosam unde laborum recusandae quae ea eveniet debitis tenetur
            esse omnis, cupiditate illum?
          </p>
          <Button />
        </div>
      </div>
    </>
  );
}

export default Card;
