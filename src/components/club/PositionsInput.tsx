import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface PositionsInputProps {
    value: string[];
    onChange: (positions: string[]) => void;
}

export function PositionsInput({ value, onChange }: PositionsInputProps) {
    const [newPosition, setNewPosition] = useState('');

    const handleAddPosition = () => {
        if (newPosition.trim() && !value.includes(newPosition.trim())) {
            onChange([...value, newPosition.trim()]);
            setNewPosition('');
        }
    };

    const handleRemovePosition = (position: string) => {
        onChange(value.filter(p => p !== position));
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Enter position"
                    value={newPosition}
                    onChange={e => setNewPosition(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPosition();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={handleAddPosition}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Add
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {value.map((position, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1"
                    >
                        <span className="text-sm text-gray-200">
                            {position}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleRemovePosition(position)}
                            className="ml-1 text-gray-400 hover:text-gray-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
