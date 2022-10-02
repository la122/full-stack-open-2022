import { Course } from "../types";

const Content = ({ courses }: { courses: Course[] }) => {
  return (
    <div>
      {courses.map(({ name, exerciseCount }) => (
        <p key={name}>
          {name} {exerciseCount}
        </p>
      ))}
    </div>
  );
};

export default Content;
