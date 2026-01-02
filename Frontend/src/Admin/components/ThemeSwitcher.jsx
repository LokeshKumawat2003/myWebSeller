import React, { useState } from 'react';
import { Palette, Settings, Check } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Card, Button } from './UI';

const ThemeSwitcher = () => {
  const { currentTheme, customColors, colorThemes, changeTheme, setCustomTheme, resetToDefaultTheme } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customThemeData, setCustomThemeData] = useState({
    bg: '#ffffff',
    bgSecondary: '#f8f9fa',
    border: '#dee2e6',
    text: '#212529',
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    accent: '#007bff',
    accentLight: '#66b3ff',
  });

  const handleCustomColorChange = (key, value) => {
    setCustomThemeData(prev => ({ ...prev, [key]: value }));
  };

  const applyCustomTheme = () => {
    setCustomTheme(customThemeData);
    setShowCustom(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="w-4 h-4" />
        Theme
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-xl">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Color Theme</h3>
            </div>

            {/* Predefined Themes */}
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium mb-2">Predefined Themes</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(colorThemes).map(([themeName, colors]) => (
                  <button
                    key={themeName}
                    onClick={() => {
                      changeTheme(themeName);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentTheme === themeName && !customColors
                        ? 'border-current shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: colors.bg }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium capitalize"
                        style={{ color: colors.textPrimary }}
                      >
                        {themeName}
                      </span>
                      {currentTheme === themeName && !customColors && (
                        <Check className="w-4 h-4" style={{ color: colors.accent }} />
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.bgSecondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.border }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Theme Toggle */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full text-left text-sm font-medium mb-2 hover:text-blue-600 transition-colors"
              >
                {showCustom ? 'Hide' : 'Show'} Custom Theme
              </button>

              {showCustom && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(customThemeData).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleCustomColorChange(key, e.target.value)}
                          className="w-full h-8 rounded border"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={applyCustomTheme}
                    >
                      Apply Custom
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={resetToDefaultTheme}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {customColors && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <Check className="w-4 h-4" />
                  Custom theme is active
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ThemeSwitcher;