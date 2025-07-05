
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { useRef } from "react";

interface TruckDocumentUploadProps {
  documentType: string;
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
}

export const TruckDocumentUpload = ({ 
  documentType, 
  onFileSelect, 
  selectedFile 
}: TruckDocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'ntsa_certificate':
        return 'NTSA';
      case 'insurance_certificate':
        return 'Insurance';
      case 'tgl_certificate':
        return 'TGL';
      default:
        return 'Document';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <File className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-400 truncate max-w-[100px]">
            {selectedFile.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="h-6 w-6 p-0 text-green-700 dark:text-green-400 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          className="flex items-center gap-1 px-3 py-1 h-8 text-xs"
        >
          <Upload className="w-3 h-3" />
          Upload {getDocumentLabel(documentType)}
        </Button>
      )}
    </div>
  );
};
