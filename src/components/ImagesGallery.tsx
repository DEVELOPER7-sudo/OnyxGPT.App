import { useState } from 'react';
import { storage } from '@/lib/storage';
import { ImageGeneration } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Download, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const ImagesGallery = () => {
  const [images] = useState<ImageGeneration[]>(storage.getImages());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredImages = images.filter(img =>
    img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteImage(id);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4 animate-fadeIn">
        <h1 className="text-2xl font-bold mb-4">Images Gallery</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search images by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glow-blue"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Total images: {filteredImages.length}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredImages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              {searchQuery ? 'No images found' : 'No images generated yet. Use /img command to create images.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <Card key={img.id} className="overflow-hidden group animate-slideUp hover:shadow-lg transition-all">
                <div className="relative aspect-square">
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleDownload(img.imageUrl, img.prompt)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => window.open(img.imageUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(img.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {img.prompt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="badge-blue">{img.model}</span>
                    <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesGallery;
