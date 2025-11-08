import React,{useEffect,useState} from "react";
const API = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export default function Drive(){
    const [file,setFile]=useState(null);
    const [files,setFiles]=useState([]);
    const [loading, setLoading]=useState(false);
    useEffect(()=>{
        fetchFiles();
    },[]);
    async function fetchFiles(){
        try{
            const res = await fetch(`${API}/api/files`);
            const data = await res.json();
            setFiles(Array.isArray(data) ? data : []);
        }catch(err){
            console.log("Fetch files err:",err);
            setFiles([]);
        }
    }
    async function handleUpload(e){
        e.preventDefault();
        if(!file) return alert("Please select a file first!");
        setLoading(true);
        try{
            const fd = new FormData();
            fd.append("file",file);
            const res = await fetch(`${API}/api/files/upload`,{
                method:"POST",
                body:fd,
            });
            const data = await res.json();
            if(data.success){
                setFile(null);
                fetchFiles();
            }else{
                alert("Upload failed");
            }
        }catch(err){
            console.error(err);
            alert("Upload error");
        }finally{
            setLoading(false);
        }
    }
    function formatUrl (f){
        const raw = f.filepath || f.path || "";
        const normalized = raw.replace(/\\/g,"/").replace(/^\/+/, "");
        return `${API}/${normalized}`;
    }
    return(
        <div className="card">
            <h2>Cloud Drive</h2>
            <p className="smalll">Upload files.Files are stored  on server in <code>/uploads</code></p>
            <input 
            type="file"
            onChange={(e)=>setFile(e.target.files?.[0] || null)}/>
            <div className="controls-row">
                <button className="btn primary" onClick={handleUpload} disabled={loading}>
                    {loading ? "uploading..." :"upload"}
                </button>
                <button className="btn ghost" onClick={fetchFiles}>Refresh</button>
            </div>

            <h3 style={{marginTop:14}}>Recent files</h3>
            <div className="file-list">
                {files.length===0 && <div className="small">No files uploaded yet.</div>}
                {files.map((f)=>(
                    <div className="file-item" key={f._id || f.filename}>
                        <div className="file-left">
                            <div className="file-name">{f.filename || f.originalName}</div>
                            <div className="file-meta">{new Date(f.uploadedAt || f.createdAt || Date.now()).toLocaleString()}</div>

                        </div>
                        <div>
                            <a href={formatUrl(f)} target="_blank" rel="noreferrer" style={{color:"var(--primary)",fontWeight:700}}>Open</a>
                        </div>
                    </div>

                
                ))}
            </div>
        </div>
    )
}