import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Sparkles, Terminal } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "System Initialized. I am your ALGORISE AI Tutor. How can I assist with your logic today?" }] },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    // Auto-scroll to latest "transmission"
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsTyping(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage], // Include current message in history
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: response.data.message }] 
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: "CRITICAL_ERROR: Connection to Neural Link severed. Please retry." }] 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header / Signal Indicator */}
            <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bot size={20} className="text-cyan-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">AI Neural Tutor</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-2/3"></div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">SYNC_OK</span>
                </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-cyan-500/[0.02]">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all
                                ${msg.role === "user" 
                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"}`}>
                                {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                            </div>
                            
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed font-medium
                                ${msg.role === "user" 
                                    ? "bg-slate-900 border border-white/10 text-slate-200 rounded-tr-none" 
                                    : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none font-mono text-xs"}`}>
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white/5 px-4 py-2 rounded-full text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                            Processing Data...
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Hub */}
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="p-6 bg-black/40 backdrop-blur-md border-t border-white/5"
            >
                <div className="relative flex items-center group">
                    <input 
                        placeholder="Inquire about complexity, logic, or hints..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600" 
                        {...register("message", { required: true, minLength: 2 })}
                        autoComplete="off"
                    />
                    <button 
                        type="submit" 
                        disabled={errors.message || isTyping}
                        className={`absolute right-3 p-3 rounded-lg transition-all
                            ${isTyping ? "text-slate-700" : "text-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"}`}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[9px] text-center text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">
                    ALGORISE AI can provide hints but won't solve it for you.
                </p>
            </form>
        </div>
    );
}

export default ChatAi;