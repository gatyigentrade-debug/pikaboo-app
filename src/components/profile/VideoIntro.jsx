import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Play, Trash2, Upload, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MAX_DURATION_S = 15;

export default function VideoIntro() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    // Validate duration via a temporary object URL
    const tempUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = tempUrl;
    await new Promise((res) => { tempVideo.onloadedmetadata = res; });
    URL.revokeObjectURL(tempUrl);

    if (tempVideo.duration > MAX_DURATION_S) {
      setError(`Video must be ${MAX_DURATION_S} seconds or less.`);
      return;
    }

    setError(null);
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setVideoUrl(file_url);
    setUploading(false);
  };

  const handleDelete = () => {
    setVideoUrl(null);
    setPlaying(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="bg-secondary/50 rounded-2xl p-4 border border-border/30 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          <p className="text-sm font-heading font-semibold text-foreground">Intro Video</p>
          <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-heading font-bold">
            15s max
          </span>
        </div>
        {videoUrl && (
          <button onClick={handleDelete} className="text-destructive/70 hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground font-body">
        Let people hear your voice & see your personality before matching 🎬
      </p>

      {/* Video preview */}
      <AnimatePresence mode="wait">
        {videoUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden bg-black aspect-video"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              onEnded={() => setPlaying(false)}
              playsInline
            />
            {/* Play overlay */}
            {!playing && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </button>
            )}
            {playing && (
              <button
                onClick={togglePlay}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-secondary/30 hover:bg-primary/5"
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
                <p className="text-xs text-muted-foreground font-body">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-body text-center px-4">
                  Tap to upload a short intro video
                </p>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive font-body">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}