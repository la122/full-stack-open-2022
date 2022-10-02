import { CoursePart } from "../types";

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.type) {
    case "normal":
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
        </p>
      );
    case "groupProject":
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          group projects: {part.groupProjectCount}
        </p>
      );
    case "submission":
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          <i>{part.description}</i>
          <br />
          submit to {part.exerciseSubmissionLink}
        </p>
      );
    case "detailed":
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          <i>{part.description}</i>
        </p>
      );
    case "special":
      return (
        <p>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <br />
          <i>{part.description}</i>
          <br />
          required skills: {part.requirements.join(", ")}
        </p>
      );
  }
};

export default Part;
