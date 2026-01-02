import React from 'react';
import { Edit, Trash2, Calendar, Tag, Palette, Ruler, Shirt } from 'lucide-react';
import { Card, Button, Badge } from '../UI';
import { useThemeColors } from '../../AdminContext';

const CategoriesTable = ({ categories, onEdit, onDelete }) => {
  const colors = useThemeColors();

  const renderAttributes = (attributes) => {
    if (!attributes || attributes.length === 0) return 'None';

    return (
      <div className="flex flex-wrap gap-1">
        {attributes.map((attr, idx) => {
          const getIcon = (name) => {
            switch (name) {
              case 'size': return <Ruler className="w-3 h-3" />;
              case 'color': return <Palette className="w-3 h-3" />;
              case 'fit': return <Shirt className="w-3 h-3" />;
              default: return <Tag className="w-3 h-3" />;
            }
          };

          return (
            <Badge key={idx} variant="secondary" className="text-xs">
              {getIcon(attr.name)}
              {attr.name}: {attr.values?.length || 0}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Attributes</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="transition-colors" style={{ borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.bgSecondary }}>
                        <Tag className="w-5 h-5" style={{ color: colors.accent }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{category.name}</div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>ID: {category._id?.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm max-w-xs truncate" style={{ color: colors.textPrimary }}>
                    {category.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {renderAttributes(category.attributes)}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => onDelete(category._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CategoriesTable;