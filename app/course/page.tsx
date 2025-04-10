// app/courses/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseLayout } from "@/components/course-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateCourseContent, saveCourseToSupabase } from "@/utils/gemini";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Course } from "./constant";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [audience, setAudience] = useState("general");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState(null);

  // Check authentication and fetch user's courses
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Fetch user's courses
      const { data, error } = await supabase
        .from("courses")
        .select("content")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        toast("Failed to load your courses");
        return;
      }

      if (data) {
        setCourses(data.map((item) => item.content));
      }
    };

    checkAuth();
  }, [router]);

  const handleCreateCourse = async () => {
    if (!courseTitle.trim()) {
      toast("Please enter a course title");
      return;
    }

    if (!user) {
      toast("Please log in to create a course");
      return;
    }

    setIsLoading(true);

    try {
      // Generate course content with Gemini API
      const course = await generateCourseContent(
        courseTitle,
        audience,
        difficulty
      );

      if (!course) {
        toast("Failed to generate course content");
        setIsLoading(false);
        return;
      }

      // Override description if provided by user
      if (courseDescription.trim()) {
        course.description = courseDescription;
      }

      // Save course to Supabase
      const { success, error } = await saveCourseToSupabase(course, user.id);

      if (!success) {
        toast("Failed to save course: " + (error?.message || "Unknown error"));
        setIsLoading(false);
        return;
      }

      // Add course to local state
      setCourses([course, ...courses]);

      // Reset form and close dialog
      setCourseTitle("");
      setCourseDescription("");
      setIsOpen(false);

      toast("Course created successfully!");

      // Navigate to the new course
      router.push(`/course/${course.id}`);
    } catch (error) {
      console.error("Error in handleCreateCourse:", error);
      toast("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CourseLayout>
      <div>
        <Toaster />
      </div>
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-[70%] py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Welcome to CourseGPT</h1>
              <Button onClick={() => setIsOpen(true)}>Create New Course</Button>
            </div>

            {courses.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You havent created any courses yet.
                </p>
                <Button onClick={() => setIsOpen(true)}>
                  Create Your First Course
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/course/${course.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Provide details about the course you want to create.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseTitle">Course Topic</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseDescription">
                Course Description (Optional)
              </Label>
              <Textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Describe what this course will cover..."
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={audience}
                  onValueChange={setAudience}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginners">Beginners</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="professionals">Professionals</SelectItem>
                    <SelectItem value="experts">Experts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={difficulty}
                  onValueChange={setDifficulty}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCourse} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CourseLayout>
  );
}
