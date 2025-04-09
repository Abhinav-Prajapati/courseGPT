// app/courses/[id]/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourseLayout } from "@/components/course-layout";
import { dummyCourses } from "../constant";
import { notFound } from "next/navigation";

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = dummyCourses.find((c) => c.id === params.id);

  if (!course) return notFound();

  return (
    <CourseLayout>
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="mx-auto w-[70%] py-8 px-4">
            <BackButton />
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground text-lg mt-2 mb-8">
              {course.description}
            </p>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Learning Outcomes</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 text-primary h-6 w-6 flex items-center justify-center text-sm mt-0.5">
                          {index + 1}
                        </div>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.keyConcepts.map((concept, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{concept.term}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {concept.definition}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Main Content</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {course.mainContent}
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Activities</h2>
              <div className="space-y-4">
                {course.activities.map((activity, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        {activity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{activity.description}</p>
                      <span className="text-sm text-muted-foreground inline-block px-2 py-1 bg-secondary rounded-md">
                        {activity.type}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </CourseLayout>
  );
}

// Moved router-related logic to a client subcomponent
function BackButton() {
  "use client";
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="mb-6 flex items-center gap-2"
      onClick={() => router.push("/course")}
    >
      <ArrowLeft size={16} /> Back to Dashboard
    </Button>
  );
}
