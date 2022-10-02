interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseNormalPart extends CoursePartBase {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends Omit<CourseDetailedPart, "type"> {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseDetailedPart extends CoursePartBase {
  type: "detailed";
  description: string;
}

interface CourseSpecialPart extends Omit<CourseDetailedPart, "type"> {
  type: "special";
  requirements: string[];
}

export type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseDetailedPart
  | CourseSpecialPart;
