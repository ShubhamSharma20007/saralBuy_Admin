import React, { useEffect, useRef } from 'react'
import ComponentCard from '../../components/common/ComponentCard'
import FileInput from '../../components/form/input/FileInput'
import Label from '../../components/form/Label';
import Button from '../../components/ui/button/Button';
import { toast } from 'sonner';
import Input from '../../components/form/input/InputField';
import { useFetch } from '../../hooks/useFetch';
import { AnalyticsInstance } from '../../service/analytics.service';

const BannerBucket = () => {
  const { fn, data, loading } = useFetch(AnalyticsInstance.bannerImageUpload);
  const [file, setFile] = React.useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // 👈 ref to form

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        event.target.value = "";
        return;
      }
      setFile(file);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const title = (event.target as any)[0].value;
    const target_link = (event.target as any)[1].value;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("target_link", target_link);
    await fn(formData);
  }

  useEffect(() => {
    if (data) {
      toast.success("Banner Image Uploaded Successfully");
      setFile(null);
      formRef.current?.reset();
    }
  }, [data]);

  return (
    <div className="w-full sm:h-[calc(100vh-150px)] flex justify-center items-center">
      <ComponentCard title="Banner Image Upload" className="mx-auto sm:w-1/2 ">
        <form ref={formRef} onSubmit={handleSubmit} className="grid space-y-6">
          <Label>Title</Label>
          <Input
            className="custom-class"
            name="title"
            placeholder="Banner Title (ex. All the Latest Smartphones. One Place. Smart Deals Inside!)"
          />
          <Label>Target Link</Label>
          <Input
            type="url"
            className="custom-class"
            name="target_link"
            placeholder="Redirect Link (ex. https://saralbuy.com/requirements"
          />
          <Label>
            Upload file <span className="text-red-400">*</span>
          </Label>
          <FileInput
            onChange={handleFileChange}
            className="custom-class"
            props={{ accept: "image/png, image/jpeg, image/jpg" }}
          />
          <Button disabled={loading} size="sm" className="w-full">
            {loading ? "Uploading..." : "Upload Banner Image"}
          </Button>
        </form>
      </ComponentCard>
    </div>
  );
};

export default BannerBucket;
