import React, { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export default function Chat() {
    const [text, setText] = useState("");
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef();

    useEffect(() => {
        scrollBottom();
    }, []);

    function scrollBottom() {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }

    async function send() {
        if (!text.trim()) return;
        const userMsg = { sender: "You", message: text, timestamp: new Date().toISOString() }
        setMessage((p) => [...p, userMsg]);
        setText("");
        scrollBottom();

        setLoading(true);

        try{
            const res = await fetch(`${API}/api/chat`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({message:text}),
            });

            const data = await res.json();
            const aiMsg = { sender: "AI", message: data.reply || "(no reply)", timestamp: new Date().toISOString()};
            setMessage((p)=> [...p,aiMsg]);
            scrollBottom();
        }
        catch(err){
            console.error(err);
            setMessage((p)=> [...p, {sender: "AI", message: "(error)", timestamp: new Date().toISOString()}]);
        } finally{
            setLoading(false);
        }
    }

    return(
        <div className="card">
        <h2> ChatAI</h2>
        <p className="small">Ask anything - server forwards to OpenAI and returns AI reply.</p>
        <div className="chat-window" ref={ref}>
            {message.length === 0 && <div className="small">No message yet - say hi </div>}
            {message.map((m, i)=>(
                <div className="msg" key={i}>
                    <div className="who" style={{color: m.sender === "AI" ? "var(--accent)" : "#111"}}>
                        {m.sender}
                    </div>
                    <div className="txt">{m.message}</div>
                    <div className="small" style={{margin: 6}}>{new Date(m.timestamp).toLocaleString()}</div>
                </div>
            ))}
        </div>

        <div className="input-row">
            <input type="text"
            placeholder='Type message (e.g. "Summarize a file")'
            value={text}
            onChange={(e)=> setText(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter" && send()}
            />
            <button onClick={send} disabled={loading}>{loading ? "...":"Send"}</button>
        </div>
        </div>
    );
}