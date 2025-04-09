"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseLayout } from "@/components/course-layout";
import { dummyCourses } from "./constant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const handleCreateCourse = () => {
    // Empty function that would handle course creation
    console.log("Creating course:", { courseTitle, courseDescription });

    // Reset form and close dialog
    setCourseTitle("");
    setCourseDescription("");
    setIsOpen(false);
  };

  return (
    <CourseLayout>
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-[70%] py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Welcome to CourseGPT</h1>
              <Button onClick={() => setIsOpen(true)}>Create New Course</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dummyCourses.map((course) => (
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
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Enter course title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseDescription">Course Description</Label>
              <Textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Describe what this course will cover..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>Generate Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CourseLayout>
  );
}
