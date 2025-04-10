// app/courses/[id]/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourseLayout } from "@/components/course-layout";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Course } from "@/app/course/constant";
import { Skeleton } from "@/components/ui/skeleton";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";

import "prismjs/themes/prism-tomorrow.css";

export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      Prism.highlightAll();
    }
  }, [course]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching course:", error);
          setError("Failed to load course content");
          return;
        }

        if (!data) {
          setError("Course not found");
          return;
        }
        setCourse(data.content as Course);
      } catch (err) {
        console.error("Error in fetchCourse:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [params.id]);

  if (error) {
    return (
      <CourseLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-[500px]">
            <CardContent className="pt-6">
              <BackButton />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">
                  Error
                </h2>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CourseLayout>
    );
  }

  if (loading) {
    return <CourseLoadingSkeleton />;
  }

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
                <CardContent className="pt-6 prose max-w-none dark:prose-invert">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(course.mainContent),
                    }}
                  />
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

function renderMarkdown(content: string): string {
  const processedContent = content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, language, code) => {
      const lang = language || "plaintext";
      const highlightedCode = Prism.highlight(
        code.trim(),
        Prism.languages[lang] || Prism.languages.plaintext,
        lang
      );
      return `<pre class="language-${lang} overflow-x-auto p-4 rounded-md"><code class="language-${lang}">${highlightedCode}</code></pre>`;
    }
  );

  return processedContent
    .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-semibold my-4">$1</h2>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
    )
    .replace(/\*\s+(.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .split("\n\n")
    .map((paragraph) => (paragraph.trim() ? `<p>${paragraph}</p>` : ""))
    .join("\n");
}

function CourseLoadingSkeleton() {
  return (
    <CourseLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="mx-auto w-[70%] py-8 px-4">
            <Skeleton className="h-10 w-40 mb-6" />
            <Skeleton className="h-14 w-full mb-2" />
            <Skeleton className="h-8 w-3/4 mb-8" />

            <Separator className="my-8" />

            <section className="mb-8">
              <Skeleton className="h-8 w-48 mb-4" />
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <Skeleton className="h-8 w-44 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-7 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <Skeleton className="h-8 w-44 mb-4" />
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </CourseLayout>
  );
}

// Moved router-related logic to a client subcomponent
function BackButton() {
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
