"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Ghost, Upload, Download, File, Trash2, Eye, EyeOff, Lock, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadDate: Date
  expiryDate: Date | null
  password?: string
  maxViews: number
  maxDownloads: number
  currentViews: number
  currentDownloads: number
  isEncrypted: boolean
}

export default function GhostFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Upload settings
  const [expiryOption, setExpiryOption] = useState<"24h" | "7d" | "never">("never")
  const [filePassword, setFilePassword] = useState("")
  const [maxViews, setMaxViews] = useState(100)
  const [maxDownloads, setMaxDownloads] = useState(50)
  const [enableEncryption, setEnableEncryption] = useState(false)

  const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

  const getExpiryDate = (option: string): Date | null => {
    const now = new Date()
    switch (option) {
      case "24h":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case "7d":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case "never":
        return null
      default:
        return null
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check file size
      const oversizedFiles = acceptedFiles.filter((file) => file.size > MAX_FILE_SIZE)
      if (oversizedFiles.length > 0) {
        alert(`Dosya boyutu 500MB'ı geçemez: ${oversizedFiles.map((f) => f.name).join(", ")}`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      for (const file of acceptedFiles) {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        // Simulate encryption if enabled
        if (enableEncryption) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadDate: new Date(),
          expiryDate: getExpiryDate(expiryOption),
          password: filePassword || undefined,
          maxViews,
          maxDownloads,
          currentViews: 0,
          currentDownloads: 0,
          isEncrypted: enableEncryption,
        }

        setFiles((prev) => [...prev, newFile])
      }

      setUploading(false)
      setUploadProgress(0)
      setFilePassword("")
    },
    [expiryOption, filePassword, maxViews, maxDownloads, enableEncryption],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const downloadFile = (file: UploadedFile) => {
    if (file.currentDownloads >= file.maxDownloads) {
      alert("İndirme limiti aşıldı!")
      return
    }

    if (file.password && !prompt("Dosya şifresi:")) {
      return
    }

    // Update download count
    setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, currentDownloads: f.currentDownloads + 1 } : f)))

    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.click()
  }

  const viewFile = (file: UploadedFile) => {
    if (file.currentViews >= file.maxViews) {
      alert("Görüntüleme limiti aşıldı!")
      return
    }

    if (file.password && !prompt("Dosya şifresi:")) {
      return
    }

    // Update view count
    setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, currentViews: f.currentViews + 1 } : f)))

    window.open(file.url, "_blank")
  }

  const isFileExpired = (file: UploadedFile) => {
    return file.expiryDate && new Date() > file.expiryDate
  }

  const getTimeRemaining = (expiryDate: Date | null) => {
    if (!expiryDate) return "Sonsuz"
    const now = new Date()
    const diff = expiryDate.getTime() - now.getTime()
    if (diff <= 0) return "Süresi doldu"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} gün ${hours} saat`
    return `${hours} saat`
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-white text-gray-900"
      }`}
    >
      {/* Floating Ghosts Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce opacity-10 ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            <Ghost size={32 + i * 8} />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Ghost size={48} className="text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              files.ghos.tr
            </h1>
            <Ghost size={48} className="text-purple-400 animate-pulse" />
          </div>
          <p className={`text-xl mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            👻 Güvenli ve şifreli dosya paylaşımı
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="sm"
              className={`${isDarkMode ? "border-purple-500 text-purple-400" : "border-purple-600 text-purple-600"}`}
            >
              {isDarkMode ? <Eye size={16} /> : <EyeOff size={16} />}
              {isDarkMode ? "Aydınlık Mod" : "Karanlık Mod"}
            </Button>
            <a
              href="/status"
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-colors ${
                isDarkMode
                  ? "border-green-500 text-green-400 hover:bg-green-500/10"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              🚀 Status
            </a>
          </div>
        </div>

        {/* Upload Settings */}
        <Card
          className={`mb-8 ${isDarkMode ? "bg-gray-800/50 border-purple-500/30" : "bg-white/80 border-purple-200"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-purple-400" />
              Yükleme Ayarları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Temel Ayarlar</TabsTrigger>
                <TabsTrigger value="security">Güvenlik</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiry">Dosya Süresi</Label>
                    <Select
                      value={expiryOption}
                      onValueChange={(value: "24h" | "7d" | "never") => setExpiryOption(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Saat</SelectItem>
                        <SelectItem value="7d">7 Gün</SelectItem>
                        <SelectItem value="never">Sonsuz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxViews">Maksimum Görüntüleme</Label>
                    <Input
                      id="maxViews"
                      type="number"
                      value={maxViews}
                      onChange={(e) => setMaxViews(Number(e.target.value))}
                      min="1"
                      max="1000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxDownloads">Maksimum İndirme</Label>
                    <Input
                      id="maxDownloads"
                      type="number"
                      value={maxDownloads}
                      onChange={(e) => setMaxDownloads(Number(e.target.value))}
                      min="1"
                      max="500"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Dosya Şifresi (İsteğe bağlı)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={filePassword}
                      onChange={(e) => setFilePassword(e.target.value)}
                      placeholder="Güçlü bir şifre girin"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="encryption" checked={enableEncryption} onCheckedChange={setEnableEncryption} />
                    <Label htmlFor="encryption">Dosya Şifreleme</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card
          className={`mb-8 border-2 border-dashed transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800/50 border-purple-500 hover:border-purple-400"
              : "bg-white/50 border-purple-300 hover:border-purple-500"
          } ${isDragActive ? "border-pink-400 bg-purple-500/10 scale-105" : ""}`}
        >
          <CardContent className="p-8">
            <div {...getRootProps()} className={`text-center cursor-pointer transition-all duration-300`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`p-6 rounded-full transition-all duration-300 ${
                    isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
                  } ${isDragActive ? "animate-pulse scale-110" : ""}`}
                >
                  <Upload size={48} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {isDragActive ? "👻 Dosyaları bırak!" : "📁 Dosyalarını sürükle veya tıkla"}
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Maksimum dosya boyutu: 500MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {uploading && (
          <Card className={`mb-8 ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Ghost className="animate-spin text-purple-400" size={24} />
                <div className="flex-1">
                  <p className="mb-2">
                    {enableEncryption ? "Şifreleniyor ve yükleniyor..." : "Yükleniyor..."} {uploadProgress}%
                  </p>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <Card className={`${isDarkMode ? "bg-gray-800/50" : "bg-white/50"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="text-purple-400" />
                Yüklenen Dosyalar ({files.length})
              </CardTitle>
              <CardDescription>Dosyalarını yönet ve paylaş</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700/50 border-gray-600 hover:border-purple-400"
                        : "bg-gray-50 border-gray-200 hover:border-purple-300"
                    } ${isFileExpired(file) ? "opacity-50" : "hover:scale-[1.02]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded ${isDarkMode ? "bg-purple-900/50" : "bg-purple-100"}`}>
                          <File size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{file.name}</h4>
                            {file.isEncrypted && <Lock size={14} className="text-green-500" />}
                            {file.password && <Shield size={14} className="text-blue-500" />}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span>{formatFileSize(file.size)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {file.type || "Unknown"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{getTimeRemaining(file.expiryDate)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                            <span>
                              👁️ {file.currentViews}/{file.maxViews}
                            </span>
                            <span>
                              ⬇️ {file.currentDownloads}/{file.maxDownloads}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => viewFile(file)}
                          size="sm"
                          variant="outline"
                          disabled={isFileExpired(file) || file.currentViews >= file.maxViews}
                          className="hover:bg-blue-500/20 hover:border-blue-400"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          onClick={() => downloadFile(file)}
                          size="sm"
                          variant="outline"
                          disabled={isFileExpired(file) || file.currentDownloads >= file.maxDownloads}
                          className="hover:bg-green-500/20 hover:border-green-400"
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteFile(file.id)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-500/20 hover:border-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            👻 files.ghos.tr - Güvenli dosya paylaşımı © 2024
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Maksimum dosya boyutu: 500MB | Şifreli ve güvenli
          </p>
        </div>
      </div>
    </div>
  )
}
