export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Welcome to the Fullstack Course
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Follow the lessons to build this into a todo app!
      </p>
      <p className="text-sm text-muted-foreground">
        Start with{" "}
        <a href="./docs/lessons/01-setup.md" className="text-primary underline">
          Lesson 1: Setup & Environment
        </a>
      </p>
    </div>
  );
}
