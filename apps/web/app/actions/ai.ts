"use client";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
});

export const refineContent = async(content:string)=>{
    if(!content) return "";

    try{
        const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an Intellectual Property expert. Your job is to rewrite the user's rough notes into a professional, detailed technical description suitable for timestamping and copyright protection. Keep the core meaning but expand on technical details. Output in Markdown."
        },
        { role: "user", content: content }
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content || "";
    }catch(error){
        console.error("AI Error:", error);
        return null;
    }
}
