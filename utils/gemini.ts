import { Course } from "@/app/course/constant";
import { supabase } from "@/lib/supabaseClient";

// Gemini API constants
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Extracts JSON content from text that might be wrapped in markdown code blocks
 * or mixed with other content.
 *
 * @param text The text potentially containing JSON
 * @returns Cleaned string ready for JSON parsing
 */
function extractJsonFromText(text: string): string {
  // First, try to find JSON inside markdown code blocks
  const jsonCodeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
    return jsonCodeBlockMatch[1].trim();
  }

  // Next, try to find JSON inside any code blocks
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Try to find JSON-like content starting with { and ending with }
  // This is more aggressive but can help when no code blocks are used
  const jsonObjectMatch = text.match(/(\{[\s\S]*\})/);
  if (jsonObjectMatch && jsonObjectMatch[1]) {
    const possibleJson = jsonObjectMatch[1].trim();
    try {
      // Quick validation - if this parses, it's likely valid JSON
      JSON.parse(possibleJson);
      return possibleJson;
    } catch (e) {
      // If it doesn't parse, continue to other methods
    }
  }

  // Return the original text as a last resort
  return text.trim();
}

/**
 * Validates that the parsed data matches the expected Course structure
 *
 * @param data Any parsed object to validate
 * @returns Boolean indicating if the data matches the Course structure
 */
function validateCourseData(data: any): boolean {
  return (
    data &&
    typeof data.title === "string" &&
    data.title.trim() !== "" &&
    typeof data.description === "string" &&
    Array.isArray(data.learningOutcomes) &&
    Array.isArray(data.keyConcepts) &&
    data.keyConcepts.every(
      (concept: any) =>
        typeof concept.term === "string" &&
        typeof concept.definition === "string"
    ) &&
    typeof data.mainContent === "string" &&
    Array.isArray(data.activities) &&
    data.activities.every(
      (activity: any) =>
        typeof activity.title === "string" &&
        typeof activity.description === "string" &&
        typeof activity.type === "string"
    )
  );
}

/**
 * Generates course content using the Gemini API based on provided topic,
 * audience, and difficulty.
 *
 * @param topic The main subject of the course
 * @param audience Target audience for the course
 * @param difficulty Difficulty level of the course
 * @returns A Course object or null if generation fails
 */
export async function generateCourseContent(
  topic: string,
  audience: string = "general",
  difficulty: string = "intermediate"
): Promise<Course | null> {
  try {
    // Construct the prompt
    const prompt = `You are CourseGPT, an educational content generator. Create a comprehensive lesson on ${topic} for ${audience} at ${difficulty} level.
    
    Generate:
    1. A compelling title and brief description
    2. 3-5 clear learning outcomes
    3. Key concepts and terminology with definitions
    4. Main content with explanations, examples, and visuals
    5. 2-3 engaging learning activities or assessments
    
    Format the response in JSON structure according to the following schema:
    {
      "title": "",
      "description": "",
      "learningOutcomes": ["", "", ""],
      "keyConcepts": [{"term": "", "definition": ""}, ...],
      "mainContent": "",
      "activities": [{"title": "", "description": "", "type": ""}, ...]
    }

    Make sure to provide ONLY valid JSON that can be parsed by JSON.parse() with no extra text before or after. Do not include markdown code block markers in your actual response.`;

    // Prepare request data
    const requestData = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    // Make the API request
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      console.error(`Error response: ${errorText}`);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Parse the response JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", parseError);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }

    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("API response structure is invalid:", data);
      throw new Error("No text content in API response");
    }

    // Extract and clean JSON from the response text
    const jsonContent = extractJsonFromText(text);

    try {
      // Parse the JSON content
      const courseData = JSON.parse(jsonContent);

      // Validate the course data structure
      if (!validateCourseData(courseData)) {
        console.error(
          "Parsed JSON does not match expected Course structure:",
          courseData
        );
        throw new Error("Invalid course data structure");
      }

      // Generate a URL-friendly ID from the title
      const id = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Add ID to the course data
      const course: Course = {
        ...courseData,
        id,
      };

      return course;
    } catch (jsonError) {
      console.error("Failed to parse JSON content:", jsonError);
      console.error("Raw content causing error:", jsonContent);
      console.error("Original API response text:", text);

      // Attempt additional recovery methods
      try {
        // Sometimes the model adds extra text, try to find a JSON object within the response
        const jsonObjectMatch = text.match(/(\{[\s\S]*\})/);
        if (jsonObjectMatch && jsonObjectMatch[1]) {
          const possibleJson = jsonObjectMatch[1].trim();
          const fallbackData = JSON.parse(possibleJson);

          if (validateCourseData(fallbackData)) {
            const id = fallbackData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

            return { ...fallbackData, id };
          }
        }
      } catch (fallbackError) {
        // Fallback attempt failed, proceed to return null
      }

      return null;
    }
  } catch (error) {
    console.error("Error generating course content:", error);
    return null;
  }
}

/**
 * Saves a generated course to Supabase
 *
 * @param course The course object to save
 * @param userId The user ID to associate with the course
 * @returns Object indicating success or failure with optional error
 */
export async function saveCourseToSupabase(
  course: Course,
  userId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!course || !course.id || !course.title) {
      return {
        success: false,
        error: new Error("Invalid course data provided"),
      };
    }

    const { error } = await supabase.from("courses").insert({
      id: course.id,
      title: course.title,
      description: course.description,
      user_id: userId,
      content: course, // Store the entire course object in a JSONB column
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving course to Supabase:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveCourseToSupabase:", error);
    return { success: false, error };
  }
}
