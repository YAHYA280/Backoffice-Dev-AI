// D:\bureau\PFA\dev\back_office\interface\src\types\ai-assistant.ts

export interface IAIAssistantItem {
    id: string;
    name: string;
    educationLevel: string;
    type: string;
    subject: string;
    chapter: string;
    exercise: string;
    status: 'active' | 'inactive';
  }