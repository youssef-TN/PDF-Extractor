import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Download,
  Copy,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./components/ui/card";
import { Select, SelectGroup, SelectValue, SelectContent, SelectItem, SelectTrigger } from "./components/ui/select";
import { Button } from "./components/ui/button";

const PURPOSES = [
  { value: "creation", label: "Création" },
  { value: "transformation", label: "Transformation" },
  { value: "cessation liquidation", label: "Cessation/Liquidation" },
  { value: "depot des comptes annuels", label: "Dépôt des comptes annuels" },
];
const COMPANY_TYPES = [
  { value: "EURL", label: "EURL" },
  { value: "SARL", label: "SARL" },
  { value: "SAS", label: "SAS" },
  { value: "SASU", label: "SASU" },
  { value: "SCI", label: "SCI" },
];
const DOC_LABELS = {
  creation: {
    EURL: [
      "Attestation de domiciliation",
      "Attestation d'hebergement",
      "Déclaration non condamnation gérant(e)",
      "JAL",
      "Procès verbal création",
      "statuts EURL",
    ],
    SARL: [
      "Attestation d'hebergement",
      "Déclaration non condamnation gérant(e)",
      "JAL",
      "Procès verbal création",
      "statuts SARL",
    ],
    SAS: [
      "Attestation de domiciliation",
      "Attestation d'hebergement",
      "Déclaration non condamnation président(e)",
      "JAL",
      "Liste des souscripteurs d'actions (SAS)",
      "Procès verbal création",
      "statuts SAS",
    ],
    SASU: [
      "Attestation de domiciliation",
      "Attestation d'hebergement",
      "Déclaration non condamnation président(e)",
      "JAL",
      "Liste des souscripteurs d'actions (SASU)",
      "Procès verbal création",
      "statuts SASU",
    ],
    SCI: [
      "Attestation de domiciliation",
      "Attestation d'hebergement",
      "Déclaration non condamnation gérant(e)",
      "JAL",
      "Liste des gérant",
      "Procès verbal création",
      "statuts SCI",
    ],
  },
  // ... other categories ...
};

const DOC_KEYS = {
  creation: {
    EURL: [
      "attestation_de_domiciliation",
      "attestation_d_hebergement",
      "declaration_non_condamnation_gerant_e",
      "jal",
      "proces_verbal_creation",
      "statuts_eurl",
    ],
    SARL: [
      "attestation_d_hebergement",
      "declaration_non_condamnation_gerant_e",
      "jal",
      "proces_verbal_creation",
      "statuts_sarl",
    ],
    SAS: [
      "attestation_de_domiciliation",
      "attestation_d_hebergement",
      "declaration_non_condamnation_president_e",
      "jal",
      "liste_des_souscripteurs_d_actions_sas",
      "proces_verbal_creation",
      "statuts_sas",
    ],
    SASU: [
      "attestation_de_domiciliation",
      "attestation_d_hebergement",
      "declaration_non_condamnation_president_e",
      "jal",
      "liste_des_souscripteurs_d_actions_sasu",
      "proces_verbal_creation",
      "statuts_sasu",
    ],
    SCI: [
      "attestation_de_domiciliation",
      "attestation_d_hebergement",
      "declaration_non_condamnation_gerant_e",
      "jal",
      "liste_des_gerant",
      "proces_verbal_creation",
      "statuts_sci",
    ],
  },
  // ... other categories ...
};

// Mock API for testing
async function mockExtractAPI(formData) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 500));
  return {
    status: "success",
    extraction: {
      doc_name: formData.get("doc_name"),
      company_type: formData.get("company_type"),
      category: formData.get("category"),
    },
    text_excerpt: `Ceci est un extrait simulé pour ${formData.get("doc_name")}`,
  };
}

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [purpose, setPurpose] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [docStates, setDocStates] = useState({}); // { docName: { file, loading, result, error } }

  const handleFileChange = (selectedFile) => {
    setError("");
    setText("");
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("Please select a valid PDF file.");
      setFile(null);
    }
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setText("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5000/extract", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to extract text from PDF.");
      }
      const data = await response.json();
      setText(data.text || "No text extracted.");
    } catch {
      setError("Failed to extract text from PDF.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError("Failed to copy text to clipboard.");
    }
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${
      file?.name?.replace(".pdf", "") || "extracted"
    }_text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearFile = () => {
    setFile(null);
    setText("");
    setError("");
  };

  // Make upload area clickable and keyboard accessible
  const handleUploadAreaClick = () => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadAreaKeyDown = (e) => {
    if (!file && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (fileInputRef.current) fileInputRef.current.click();
    }
  };

  const handleDocFileChange = (docName, file) => {
    setDocStates((prev) => ({
      ...prev,
      [docName]: { ...prev[docName], file, error: "", result: null },
    }));
  };

  const handleDocUpload = async (docName) => {
    const docState = docStates[docName];
    if (!docState?.file) return;
    setDocStates((prev) => ({ ...prev, [docName]: { ...docState, loading: true, error: "", result: null } }));
    try {
      const formData = new FormData();
      formData.append("file", docState.file);
      formData.append("category", purpose);
      formData.append("company_type", companyType);
      formData.append("doc_name", docName);
      let data;
      if (process.env.NODE_ENV === "development" && window.location.hostname === "localhost") {
        // Use mock in dev
        data = await mockExtractAPI(formData);
      } else {
        const response = await fetch("http://localhost:5000/extract", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Extraction failed");
        data = await response.json();
      }
      setDocStates((prev) => ({ ...prev, [docName]: { ...docState, loading: false, result: data, error: "" } }));
    } catch (e) {
      setDocStates((prev) => ({ ...prev, [docName]: { ...docState, loading: false, error: "Extraction failed", result: null } }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header with selects */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl border-0">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <FileText size={40} className="mb-2" />
            <CardTitle className="text-3xl font-bold tracking-tight">PDF Text Extractor</CardTitle>
            <p className="text-white/80 text-base font-medium">Sélectionnez la catégorie et le type de société pour voir les documents requis.</p>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className="w-64 bg-white text-gray-900 border-none shadow-md focus:ring-2 focus:ring-indigo-400">
                <SelectValue placeholder="Sélectionner la catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={companyType} onValueChange={setCompanyType}>
              <SelectTrigger className="w-64 bg-white text-gray-900 border-none shadow-md focus:ring-2 focus:ring-indigo-400">
                <SelectValue placeholder="Sélectionner le type de société" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COMPANY_TYPES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {/* Document cards */}
        {purpose && companyType && DOC_LABELS[purpose]?.[companyType] && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {DOC_LABELS[purpose][companyType].map((label, idx) => {
              const key = DOC_KEYS[purpose][companyType][idx];
              const docState = docStates[key] || {};
              return (
                <Card key={key} className="shadow-lg border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={docState.loading}
                      className="file:bg-indigo-600 file:text-white file:rounded file:px-4 file:py-2 file:border-0 file:mr-4 file:font-medium file:shadow-sm file:hover:bg-indigo-700 file:transition file:duration-150 file:ease-in-out border border-gray-200 rounded px-2 py-2 text-sm"
                      onChange={(e) => handleDocFileChange(key, e.target.files[0])}
                    />
                    {docState.error && <div className="text-red-500 text-xs mt-1">{docState.error}</div>}
                    {docState.result && docState.result.status === "success" && (
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="text-green-600 font-semibold">Extraction réussie</div>
                        <div className="text-xs text-gray-500 mt-1">Extrait :</div>
                        <textarea
                          className="w-full bg-gray-100 rounded p-2 text-xs mt-1 max-h-32 min-h-[60px] overflow-auto text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                          value={docState.result.text_excerpt}
                          readOnly
                          rows={Math.min(8, Math.max(2, (docState.result.text_excerpt.match(/\n/g) || []).length + 1))}
                        />
                        <div className="text-xs text-gray-500 mt-2">Informations extraites :</div>
                        <pre className="w-full bg-gray-50 rounded p-2 text-xs max-h-32 overflow-auto text-gray-800 border border-gray-200">
                          {JSON.stringify(docState.result.extraction, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleDocUpload(key)}
                      disabled={!docState.file || docState.loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    >
                      {docState.loading ? "Extraction..." : "Extraire"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
