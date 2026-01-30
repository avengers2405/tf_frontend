"use client"

import React, { useState } from 'react';
import { X, Send, BookOpen, Users, GraduationCap, GitCommit} from 'lucide-react';

const ProjectDashboard = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [CommitEntry, setCommitEntry] = useState([
  {
    "id": "111e4567-e89b-12d3-a456-426614174000",
    "project_id": "proj-dev-001",
    "commit_id": "a1b2c3d4",
    "commit_message": "Initial commit: setting up project structure and installing dependencies",
    "files_changed": 12,
    "additions": 450,
    "deletions": 0,
    "difficulty_of_commit": 2,
    "commit_timestamp": "2026-01-20T10:00:00.000Z",
    "received_at": "2026-01-20T10:05:00.000Z"
  },
  {
    "id": "222e4567-e89b-12d3-a456-426614174001",
    "project_id": "proj-dev-001",
    "commit_id": "e5f6g7h8",
    "commit_message": "Implemented basic Auth UI and form validation",
    "files_changed": 4,
    "additions": 120,
    "deletions": 15,
    "difficulty_of_commit": 3,
    "commit_timestamp": "2026-01-22T14:30:00.000Z",
    "received_at": "2026-01-22T14:35:00.000Z"
  },
  {
    "id": "333e4567-e89b-12d3-a456-426614174002",
    "project_id": "proj-dev-001",
    "commit_id": "i9j0k1l2",
    "commit_message": "Fixed CSS alignment in the dashboard sidebar",
    "files_changed": 1,
    "additions": 5,
    "deletions": 5,
    "difficulty_of_commit": 1,
    "commit_timestamp": "2026-01-23T09:15:00.000Z",
    "received_at": "2026-01-23T09:20:00.000Z"
  },
  {
    "id": "444e4567-e89b-12d3-a456-426614174003",
    "project_id": "proj-dev-001",
    "commit_id": "m3n4o5p6",
    "commit_message": "CRITICAL: Integrated complete backend services and data models",
    "files_changed": 45,
    "additions": 8500,
    "deletions": 0,
    "difficulty_of_commit": 5,
    "commit_timestamp": "2026-01-29T21:00:00.000Z",
    "received_at": "2026-01-29T21:02:00.000Z"
  }
]);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Smart Logbook Progress Tracker.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample project data - replace with actual data from your backend
  const projectData = {
    project_id: "550e8400-e29b-41d4-a716-446655440000", // Example UUID
    title: 'AI-Powered Campus Management System',
    description: 'Developing an intelligent campus management system that uses machine learning to optimize resource allocation, predict maintenance needs, and enhance student experience through personalized recommendations.',
    technology_stack: 'Next.js, React, Tailwind CSS, Prisma, PostgreSQL, OpenAI API',
    academic_year: '2025-2026',
    
    // Nested Git Repository data based on your Git_repository model
    git_repository: {
      repo_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      repo_url: "https://github.com/team-alpha/campus-management-system"
    },

    // Retaining existing UI data for the dashboard
    groupName: 'Team Alpha',
    members: [
      { name: 'Alex Kumar', role: 'Team Lead' },
      { name: 'Sarah Johnson', role: 'Backend Developer' },
      { name: 'Mike Chen', role: 'Frontend Developer' },
      { name: 'Priya Sharma', role: 'ML Engineer' }
    ],
    teacher: {
      name: 'Dr. Robert Martinez',
      email: 'r.martinez@university.edu',
      department: 'Computer Science'
    },
    startDate: '2025-01-15',
    expectedCompletion: '2025-05-30'
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          projectData
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  //function to add the ability to send message on enter key press
  const handleKeyPress = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(!e){
        return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatCommitDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

// Example: new Date() -> "29/01/26"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
          <p className="text-gray-600">Manage your project and track progress</p>
        </div>

        {/* Project Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{projectData.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-semibold">{projectData.groupName}</span>
              </div>

              <div className="flex items-center text-sm text-blue-600">
                <GitCommit className="w-4 h-4 mr-2" />
                <a 
                href={projectData.git_repository.repo_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold hover:underline truncate max-w-xs md:max-w-md text-gray-600"
                >
                {projectData.git_repository.repo_url}
                </a>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Description</h3>
            <p className="text-gray-600 leading-relaxed">{projectData.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Team Members */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Team Members
              </h3>
              <div className="space-y-2">
                {projectData.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-900 font-medium">{member.name}</span>
                    <span className="text-sm text-gray-600">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher/Supervisor */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Project Supervisor
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">{projectData.teacher.name}</p>
                <p className="text-sm text-gray-600 mb-1">{projectData.teacher.email}</p>
                <p className="text-sm text-gray-500">{projectData.teacher.department}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{projectData.startDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Expected End</p>
                  <p className="font-semibold text-gray-900">{projectData.expectedCompletion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Logbook Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools & Resources</h3>
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Open Smart Logbook
          </button>
          <p className="text-sm text-gray-600 mt-2">AI-powered assistant to help with project documentation and guidance</p>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chatbot Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-semibold">Smart Logbook Assistant</h3>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {CommitEntry.map((entry) => (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900">Commit Message: {entry.commit_message}</p>
                  <p className="font-semibold text-gray-900">Difficulty: {entry.difficulty_of_commit}</p>
                  <p className="text-sm text-gray-600">Timestamp: {formatCommitDate(entry.commit_timestamp)}</p>
                </div>
              ))}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about your project..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;