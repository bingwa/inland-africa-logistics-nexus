
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Eye, AlertTriangle, CheckCircle } from "lucide-react";

const DriverDocuments = () => {
  const documents = [
    {
      name: "Driving License",
      type: "License",
      status: "Valid",
      expiry: "2025-12-15",
      lastUpdated: "2024-01-15",
      required: true
    },
    {
      name: "PSV License",
      type: "License",
      status: "Valid",
      expiry: "2025-08-20",
      lastUpdated: "2024-02-20",
      required: true
    },
    {
      name: "Medical Certificate",
      type: "Certificate",
      status: "Expiring Soon",
      expiry: "2024-08-15",
      lastUpdated: "2024-02-15",
      required: true
    },
    {
      name: "Good Conduct Certificate",
      type: "Certificate",
      status: "Valid",
      expiry: "2025-06-30",
      lastUpdated: "2024-03-01",
      required: true
    },
    {
      name: "Vehicle Inspection Report",
      type: "Report",
      status: "Valid",
      expiry: "2024-09-30",
      lastUpdated: "2024-06-30",
      required: false
    },
    {
      name: "Insurance Certificate",
      type: "Certificate",
      status: "Valid",
      expiry: "2025-03-15",
      lastUpdated: "2024-03-15",
      required: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Valid": return "bg-green-100 text-green-800 border-green-300";
      case "Expiring Soon": return "bg-orange-100 text-orange-800 border-orange-300";
      case "Expired": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Valid": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Expiring Soon": return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "Expired": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              My Documents
            </h1>
            <p className="text-muted-foreground">Manage your driving licenses and certificates</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Document Status Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Valid Documents</p>
                  <p className="text-2xl font-bold text-green-600">4</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Expired</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Documents</p>
                  <p className="text-2xl font-bold text-blue-600">6</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Document Library</CardTitle>
            <CardDescription>All your important driving documents and certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{doc.name}</h3>
                        {doc.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {doc.type}</span>
                        <span>Expires: {new Date(doc.expiry).toLocaleDateString()}</span>
                        <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.status)}
                      <Badge className={getStatusColor(doc.status) + " border"}>
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Renewal Reminders */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Renewal Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-800">Medical Certificate</p>
                    <p className="text-sm text-orange-700">Expires in 45 days - August 15, 2024</p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Renew Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
};

export default DriverDocuments;
