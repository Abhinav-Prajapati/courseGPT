export type Course = {
  id: string;
  title: string;
  description: string;
  learningOutcomes: string[];
  keyConcepts: { term: string; definition: string }[];
  mainContent: string;
  activities: { title: string; description: string; type: string }[];
};

export const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Mastering JavaScript Basics",
    description:
      "A beginner-friendly guide to learning JavaScript fundamentals including variables, loops, functions, and more.",
    learningOutcomes: [
      "Understand JavaScript syntax and variables",
      "Use control structures like loops and conditionals",
      "Define and invoke functions",
      "Manipulate arrays and objects",
      "Use JavaScript in the browser",
    ],
    keyConcepts: [
      { term: "Variable", definition: "A container for storing data values." },
      {
        term: "Loop",
        definition: "A control structure for repeated execution of code.",
      },
      {
        term: "Function",
        definition: "A reusable block of code that performs a task.",
      },
    ],
    mainContent: `Learn JavaScript from the ground up with examples such as calculating the sum of an array, looping through objects, and writing interactive code in the browser console.

Example:
\`\`\`js
function greet(name) {
  return "Hello, " + name;
}
\`\`\`
`,
    activities: [
      {
        title: "Quiz: JavaScript Syntax",
        description: "Test your knowledge of basic JS syntax.",
        type: "quiz",
      },
      {
        title: "Coding Task: Write a function",
        description: "Write a function to reverse a string.",
        type: "coding",
      },
    ],
  },
  {
    id: "2",
    title: "Introduction to Machine Learning",
    description:
      "An intermediate-level course that covers the basics of supervised and unsupervised learning algorithms.",
    learningOutcomes: [
      "Define machine learning and its applications",
      "Differentiate between supervised and unsupervised learning",
      "Understand regression and classification algorithms",
      "Apply a basic model using Python",
      "Evaluate model performance",
    ],
    keyConcepts: [
      {
        term: "Supervised Learning",
        definition: "A type of ML where the model learns from labeled data.",
      },
      {
        term: "Unsupervised Learning",
        definition:
          "ML that deals with unlabeled data to find hidden patterns.",
      },
      {
        term: "Regression",
        definition: "A method to predict continuous values.",
      },
    ],
    mainContent: `Explore ML concepts with visual examples like scatter plots for regression and clustering diagrams for unsupervised learning.

Sample Code:
\`\`\`python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
\`\`\`
`,
    activities: [
      {
        title: "Case Study: Iris Dataset",
        description: "Classify flower types using ML.",
        type: "project",
      },
      {
        title: "MCQ Test: ML Basics",
        description: "Assess your understanding of foundational ML concepts.",
        type: "quiz",
      },
    ],
  },
  {
    id: "3",
    title: "Getting Started with HTML & CSS",
    description:
      "A beginner's course on how to structure web pages using HTML and style them using CSS.",
    learningOutcomes: [
      "Understand HTML elements and structure",
      "Use CSS for styling and layout",
      "Build a simple responsive web page",
      "Work with fonts, colors, and spacing",
      "Debug layout issues",
    ],
    keyConcepts: [
      {
        term: "HTML",
        definition: "The standard markup language for creating web pages.",
      },
      {
        term: "CSS",
        definition:
          "A style sheet language used for describing the look of a document.",
      },
      {
        term: "Responsive Design",
        definition: "Design that adjusts smoothly to different screen sizes.",
      },
    ],
    mainContent: `Step-by-step tutorials on building a personal homepage. Learn about semantic tags, box model, flexbox, and media queries with visual guides.

HTML Example:
\`\`\`html
<header>
  <h1>Welcome</h1>
</header>
\`\`\`
`,
    activities: [
      {
        title: "Live Challenge: Design a Portfolio Page",
        description: "Use HTML and CSS to create your own webpage.",
        type: "coding",
      },
      {
        title: "Quiz: HTML Tags",
        description: "Identify correct HTML tag usage.",
        type: "quiz",
      },
    ],
  },
];
