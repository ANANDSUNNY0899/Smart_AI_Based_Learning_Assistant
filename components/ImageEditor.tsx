import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import { ImageIcon, LoaderIcon, UploadIcon, Wand2Icon, XCircleIcon } from './icons';

const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setOriginalMimeType(file.type);
                setEditedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please select a valid image file.');
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleGenerate = useCallback(async () => {
        if (!originalImage || !prompt.trim() || !originalMimeType) {
            setError('Please upload an image and provide an editing prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            // strip the data URL prefix: "data:image/png;base64,"
            const base64Data = originalImage.split(',')[1];
            const newImageBase64 = await geminiService.editImage(base64Data, originalMimeType, prompt);
            setEditedImage(`data:${originalMimeType};base64,${newImageBase64}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, originalMimeType, prompt]);

    return (
        <div className="flex flex-col h-full text-white bg-gray-800 p-6">
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                {/* Original Image */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600 p-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">Original Image</h3>
                    {!originalImage ? (
                         <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-700/50 rounded-md transition-colors"
                        >
                            <UploadIcon className="w-16 h-16 mb-4" />
                            <span className="font-semibold">Click to upload or drag & drop</span>
                            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                        </label>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
                            <button onClick={() => setOriginalImage(null)} className="absolute top-2 right-2 p-1 bg-gray-800/80 rounded-full text-white hover:bg-red-600 transition-colors">
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Edited Image */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600 p-4 relative">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">Edited Image</h3>
                    <div className="w-full h-full flex items-center justify-center">
                        {isLoading && (
                            <div className="flex flex-col items-center text-gray-400">
                                <LoaderIcon className="w-16 h-16 animate-spin mb-4" />
                                <span className="font-semibold">Generating...</span>
                            </div>
                        )}
                        {!isLoading && editedImage && (
                             <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-md" />
                        )}
                         {!isLoading && !editedImage && (
                            <div className="text-center text-gray-500">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                                <p>Your edited image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 pt-6">
                 {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4 text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g., Add a retro filter, make the background blurry..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading || !originalImage}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !originalImage || !prompt.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        aria-label="Generate edit"
                    >
                        {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <Wand2Icon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
