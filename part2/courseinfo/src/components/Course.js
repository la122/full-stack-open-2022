const Header = ({ name }) => <h1>{name}</h1>;

const Total = ({ sum }) => <b>total of {sum} exercises</b>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => {
  const total = course.parts.reduce((soFar, part) => soFar + part.exercises, 0);
  console.log(total);

  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
    </>
  );
};

export default Course;
