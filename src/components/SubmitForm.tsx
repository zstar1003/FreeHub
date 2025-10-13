import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { SubmitProjectData, ProjectCategory } from '../types';
import { isValidUrl } from '../utils/helpers';

interface SubmitFormProps {
  onSubmit: (data: SubmitProjectData) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  'Developer Tools',
  'Design Tools',
  'Productivity',
  'Education',
  'Entertainment',
  'Utilities',
  'Other',
];

export function SubmitForm({ onSubmit, onClose }: SubmitFormProps) {
  const [formData, setFormData] = useState<SubmitProjectData>({
    name: '',
    description: '',
    url: '',
    category: 'Developer Tools',
    tags: [],
    submittedBy: '',
    logo: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '项目名称不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '项目描述不能为空';
    } else if (formData.description.length < 20) {
      newErrors.description = '项目描述至少需要 20 个字符';
    }

    if (!formData.url.trim()) {
      newErrors.url = '项目 URL 不能为空';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = '请输入有效的 URL';
    }

    if (!formData.submittedBy.trim()) {
      newErrors.submittedBy = '提交者名称不能为空';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = '至少添加一个标签';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
      setErrors({ ...errors, tags: '' });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">提交免费项目</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="项目名称 *"
            placeholder="输入项目名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              项目描述 *
            </label>
            <textarea
              placeholder="详细描述你的项目..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              rows={4}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Input
            label="项目 URL *"
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            error={errors.url}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              分类 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              标签 *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="输入标签并按回车"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                添加
              </Button>
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
            )}
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-3 py-1 text-sm text-primary-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Logo URL (可选)"
            type="url"
            placeholder="https://example.com/logo.png"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          />

          <Input
            label="提交者 *"
            placeholder="你的名字或昵称"
            value={formData.submittedBy}
            onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
            error={errors.submittedBy}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              提交项目
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
