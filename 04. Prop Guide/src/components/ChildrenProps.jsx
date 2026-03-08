// Note - Children is a reserved prop, and you can not use this in any funciton.
// Note - We can use other props along with the children props, as shown in the Card funciton, where we have other props as well along with the childre prop.
// Children prop can have anything in it. It can be another component, It can be text, it can be html tags, litrelly ansthing.
// Basically we are putting whatever we have passed in children as it is.

// In both the components, Card and Container, we have an object with some classes, and we are displaying the class based on the object value passed as a prop. We also have a default value for the prop, in case nothing is passed while calling the function, then that value will be used automatically.
// While calling the Container in the ChildrenProps function, We have passed the <Card> component twice, so this will be displayed. The children here are the 2 Card component, which we have passed.
// Next, we have passed a lot of <p>'s inside the <Card> component, and these are now children and it will be passed inside <Card> component as it is.

function Card({ children, title, color = "blue" }) {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-500",
    green: "border-green-500 bg-green-500",
    purple: "border-purple-500 bg-purple-500",
    red: "border-red-500 bg-red-500",
  };

  return (
    <div
      className={`border-l-4 ${colorClasses[color]}  p-6 rounded-lg shoadow-md `}
    >
      {title && (
        <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      )}
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

function Container({ children, layout = "vertical" }) {
  const layoutClasses = {
    vertical: "flex flex-col space-y-4",
    horizontal: "flex flex-row flex-wrap gap-4",
    grid: "grid grid-cols-1 gap-4 md:grid-cols-2",
  };

  return <div className={layoutClasses[layout]}>{children}</div>;
}

function ChildrenProps() {
  return (
    <section className="p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-gray-800 font-bold">Children prop</h2>
      <p className="text-gray-800">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis ea sit
        sint recusandae quisquam aspernatur expedita esse amet quidem repellat.
      </p>
      <div className="space-y-6">
        <div>
          <h3>Card component with children</h3>
          <Container layout="grid">
            <Card title="User Profile" color="blue">
              <p className="mb-2">
                <strong>Name: </strong>Mayank Daga
              </p>
              <p className="mb-2">
                <strong>Email: </strong>mayankdaga81@gmail.com
              </p>
              <p className="mb-2">
                <strong>Role: </strong>Developer
              </p>
            </Card>
            <Card title="Statistics" color="green">
              <p className="mb-2">
                <strong>Name: </strong>Jogindar
              </p>
              <p className="mb-2">
                <strong>Email: </strong>yojogindar@gmail.com
              </p>
              <p className="mb-2">
                <strong>Role: </strong>Reel creator
              </p>
            </Card>
          </Container>
        </div>
      </div>
    </section>
  );
}

export default ChildrenProps;
