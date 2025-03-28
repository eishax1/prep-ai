"use client";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle, Sparkles } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "@/app/context/ThemeContext";
import { generateInterviewQuestions } from "@/utils/LangchainAgent";


// Job Role Suggestions
const JOB_ROLE_SUGGESTIONS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'Mobile App Developer',
  'UI/UX Designer'
];

// Tech Stack Suggestions
const TECH_STACK_SUGGESTIONS = {
  'Full Stack Developer': 'React, Node.js, Express, MongoDB, TypeScript',
  'Frontend Developer': 'React, Vue.js, Angular, TypeScript, Tailwind CSS',
  'Backend Developer': 'Python, Django, Flask, Java Spring, PostgreSQL',
  'Software Engineer': 'Java, C++, Python, AWS, Microservices',
  'DevOps Engineer': 'Docker, Kubernetes, Jenkins, AWS, Azure',
  'Data Scientist': 'Python, TensorFlow, PyTorch, Pandas, NumPy',
  'Machine Learning Engineer': 'Python, scikit-learn, Keras, TensorFlow',
  'Cloud Engineer': 'AWS, Azure, GCP, Terraform, Kubernetes',
  'Mobile App Developer': 'React Native, Flutter, Swift, Kotlin',
  'UI/UX Designer': 'Figma, Sketch, Adobe XD, InVision'
};

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [questions, setQuestions] = useState(5)
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
    const {theme,toggleTheme}=useTheme()

  // Auto-suggest tech stack based on job role
  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDescription(suggestion);
      toast.info(`Auto-filled tech stack for ${role}`);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(" Form Submitted with:", {
      jobPosition,
      jobDescription,
      jobExperience,
      questions,
    });
  
    try {
      const mockResponse = await generateInterviewQuestions(jobPosition, jobDescription, jobExperience, questions);
      
      console.log("Generated Interview Questions:", mockResponse);
  
      if (!mockResponse || mockResponse.length === 0) {
        throw new Error("No interview questions were generated!");
      }
  
      const res = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(mockResponse),
          jobPosition,
          jobDesc: jobDescription,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        }).returning({ mockId: MockInterview.mockId });
  
      console.log("DB Insert Result:", res);
      
      toast.success('Interview questions generated successfully!');
      router.push(`dashboard/interview/${res[0]?.mockId}`);
    } catch (error) {
      console.error("Error Generating Interview:", error);
      toast.error('Failed to generate interview questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button style={{cursor:"pointer"}}
        className="border-2 border-[#10B981] py-3 w-full z-50 rounded-lg hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className={`font-bold px-6 text-lg ${theme === "dark" ? "text-white z-50" : "text-black"} text-center cursor-pointer`}>+ Start New Interview</h1>
      </button>


      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-2xl p-6 rounded-lg shadow-xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
             Start Your Mock Interview
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role/Position</label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  placeholder="Ex. Full Stack Developer"
                  value={jobPosition}
                  required
                  onChange={(e) => setJobPosition(e.target.value)}
                  list="jobRoles"
                  className="flex-1 text-black dark:text-white"
                />
                <datalist id="jobRoles">
                  {JOB_ROLE_SUGGESTIONS.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => autoSuggestTechStack(jobPosition)}
                  disabled={!jobPosition}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Description/Tech Stack</label>
              <Textarea
                placeholder="Ex. React, Angular, Node.js, MySQL, etc."
                value={jobDescription}
                required
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-1 text-black dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
                <Input
                  type="number"
                  min="0"
                  max="70"
                  value={jobExperience}
                  required
                  onChange={(e) => setJobExperience(e.target.value)}
                  className="mt-1 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Questions</label>
                <Input
                  type="number"
                  min="0"
                  max="70"
                  value={questions}
                  required
                  onChange={(e) => setQuestions(e.target.value)}
                  className="mt-1 text-black dark:text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" /> Generating...
                </>
              ) : (
                "Start Interview"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
     </Dialog>
    </>
  );
}

export default AddNewInterview;