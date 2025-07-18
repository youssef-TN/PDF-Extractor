import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Upload multiple PDFs, text files, or scanned documents"
    },
    {
      icon: FileText,
      title: "Extract Data",
      description: "Automatically extract structured data from your documents"
    },
    {
      icon: CheckCircle,
      title: "Verify & Correct",
      description: "Review extracted data and resolve any discrepancies"
    },
    {
      icon: Download,
      title: "Generate PDF",
      description: "Create professional documents using customizable templates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Processing System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your document workflow with automated data extraction, 
            verification, and professional PDF generation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/process')}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Start Processing Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


