import { useState, useEffect } from 'react';
import { X, Key } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface SettingsModalProps {
  onClose: () => void;
}

const API_KEY_STORAGE = 'freehub_api_key';

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">设置</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Key className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Claude API Key</h3>
                <p className="mt-1 text-sm text-blue-700">
                  用于 AI 自动审核项目。你可以在{' '}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Anthropic Console
                  </a>{' '}
                  获取 API Key。
                </p>
              </div>
            </div>
          </div>

          <Input
            label="API Key"
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              {saved ? '已保存！' : '保存设置'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-xs text-yellow-800">
              注意：API Key 仅存储在浏览器本地，不会上传到任何服务器。在生产环境中，建议通过后端代理调用 API。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}
