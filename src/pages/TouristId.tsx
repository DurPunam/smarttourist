import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';
import { 
  IdCard, 
  Upload, 
  QrCode, 
  Shield, 
  CheckCircle,
  FileText,
  Camera,
  Hash,
  Download,
  X,
  User,
  Phone,
  Mail,
  Globe,
  CreditCard
} from 'lucide-react';

const TouristId = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    aadhaarNumber: '',
    phoneNumber: '',
    email: ''
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [generatedId] = useState({
    id: 'TST-2024-INB-7829',
    issuedDate: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      setDocumentFile(file);
      setDocumentName(file.name);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setDocumentName(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.nationality || !formData.phoneNumber || !formData.email) {
      alert('Please fill all required fields');
      return;
    }
    
    if (!photoFile) {
      alert('Please upload your photo');
      return;
    }
    
    if (!documentFile) {
      alert('Please upload supporting document');
      return;
    }
    
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  // Generate QR code when ID is generated
  useEffect(() => {
    if (step === 3) {
      const qrData = JSON.stringify({
        id: generatedId.id,
        name: formData.fullName,
        nationality: formData.nationality,
        phone: formData.phoneNumber,
        email: formData.email,
        issued: generatedId.issuedDate,
        validUntil: generatedId.validUntil
      });

      QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error('QR Code generation error:', err);
        });
    }
  }, [step, generatedId, formData]);

  const verificationSteps = [
    { step: 1, title: 'Document Upload', completed: step > 1 },
    { step: 2, title: 'Verification', completed: step > 2 },
    { step: 3, title: 'ID Generated', completed: step >= 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Digital Tourist ID</h1>
          </div>
          <p className="text-xl text-muted-foreground">Secure digital identity verification for tourists</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {verificationSteps.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    item.completed ? 'bg-green-500 text-white border-green-500' : 
                    step === item.step ? 'bg-primary text-primary-foreground border-primary' :
                    'bg-background text-muted-foreground border-border'
                  }`}>
                    {item.completed ? <CheckCircle className="w-6 h-6" /> : item.step}
                  </div>
                  <p className="font-medium text-sm mt-2">{item.title}</p>
                </div>
                {index < verificationSteps.length - 1 && (
                  <div className={`w-16 h-1 ${item.completed ? 'bg-green-500' : 'bg-border'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Document Upload & Information</CardTitle>
              <CardDescription>Provide your identity documents and information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Nationality *</Label>
                    <Input name="nationality" value={formData.nationality} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Passport Number</Label>
                    <Input name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Aadhaar Number</Label>
                    <Input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo */}
                  <div>
                    <Label>Photo *</Label>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <div 
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                      onClick={() => !photoPreview && photoInputRef.current?.click()}
                    >
                      {photoPreview ? (
                        <div className="space-y-2">
                          <div className="relative inline-block">
                            <img src={photoPreview} alt="Preview" className="w-32 h-32 mx-auto rounded-lg object-cover" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); photoInputRef.current?.click(); }}>
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="py-6">
                          <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p>Click to upload photo</p>
                          <p className="text-xs text-muted-foreground">Max 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document */}
                  <div>
                    <Label>Document *</Label>
                    <input ref={documentInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleDocumentUpload} className="hidden" />
                    <div 
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                      onClick={() => !documentName && documentInputRef.current?.click()}
                    >
                      {documentName ? (
                        <div className="space-y-2 py-6">
                          <div className="relative inline-block">
                            <FileText className="w-16 h-16 mx-auto text-primary" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeDocument(); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm break-all px-2">{documentName}</p>
                          <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); documentInputRef.current?.click(); }}>
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="py-6">
                          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p>Click to upload document</p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, Image - Max 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Proceed to Verification
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Verifying Documents</h3>
              <p className="text-muted-foreground">Please wait...</p>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="max-w-4xl mx-auto border-green-500">
              <CardHeader className="bg-green-50 dark:bg-green-950">
                <CardTitle className="flex items-center justify-center text-green-700 dark:text-green-300">
                  <CheckCircle className="w-8 h-8 mr-2" />
                  ID Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Digital ID Card</h3>
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl text-white">
                      <div className="flex justify-between mb-4">
                        <Shield className="w-8 h-8" />
                        <Badge className="bg-white/20">Govt of India</Badge>
                      </div>
                      {photoPreview && (
                        <img src={photoPreview} alt="ID" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/30 object-cover" />
                      )}
                      <h4 className="text-2xl font-bold mb-2">{formData.fullName}</h4>
                      <p className="text-sm">ID: {generatedId.id}</p>
                      <p className="text-sm">{formData.nationality}</p>
                      <p className="text-sm">{formData.phoneNumber}</p>
                      <p className="text-xs mt-3 border-t border-white/20 pt-2">
                        Valid: {new Date(generatedId.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">QR Code</h3>
                    <div className="flex justify-center">
                      {qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-48 h-48 border-4 border-primary rounded-lg"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-white border-4 border-primary rounded-lg flex items-center justify-center">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-3">Scan for verification</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button><Download className="w-4 h-4 mr-2" />Download ID</Button>
                  <Button variant="outline"><QrCode className="w-4 h-4 mr-2" />Print QR Code</Button>
                  <Button variant="secondary">Send to Email</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Secure Storage</h4>
                    <p className="text-sm text-muted-foreground">Encrypted database storage</p>
                  </div>
                  <div className="text-center p-4">
                    <QrCode className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">QR Verification</h4>
                    <p className="text-sm text-muted-foreground">Quick scan for authentication</p>
                  </div>
                  <div className="text-center p-4">
                    <IdCard className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Digital ID</h4>
                    <p className="text-sm text-muted-foreground">Government verified identity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristId;
