import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Rocket,
  Star,
  Heart,
  Flame,
  Crown,
  Zap,
  Compass,
  Target,
  Shield,
  Briefcase,
  Lightbulb,
  Layers,
  Cpu,
  Globe,
  Gem,
  Award,
  BookOpen,
  Calendar,
  FolderKanban,
  TrendingUp,
  Wallet,
  Users,
  Home,
} from "lucide-react";

export const CARD_ICON_IMAGES_STORAGE_KEY = "aio_card_custom_icon_images";
export const CARD_ICON_IMAGES_EVENT_KEY = "aio_card_custom_icon_images_updated";

export type CardIconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

export type CardCustomIconValue =
  | { type: "preset"; iconId: string }
  | { type: "image"; src: string };

export interface CardIconPreset {
  id: string;
  name: string;
  icon: CardIconComponent;
}

export const CARD_ICON_PRESETS: CardIconPreset[] = [
  { id: "sparkles", name: "Sparkles", icon: Sparkles },
  { id: "rocket", name: "Rocket", icon: Rocket },
  { id: "star", name: "Bintang", icon: Star },
  { id: "heart", name: "Hati", icon: Heart },
  { id: "flame", name: "Api", icon: Flame },
  { id: "crown", name: "Mahkota", icon: Crown },
  { id: "zap", name: "Kilat", icon: Zap },
  { id: "compass", name: "Kompas", icon: Compass },
  { id: "target", name: "Target", icon: Target },
  { id: "shield", name: "Perisai", icon: Shield },
  { id: "briefcase", name: "Bisnis", icon: Briefcase },
  { id: "lightbulb", name: "Ide", icon: Lightbulb },
  { id: "layers", name: "Lapisan", icon: Layers },
  { id: "cpu", name: "Teknologi", icon: Cpu },
  { id: "globe", name: "Global", icon: Globe },
  { id: "gem", name: "Permata", icon: Gem },
  { id: "award", name: "Prestasi", icon: Award },
  { id: "book-open", name: "Buku", icon: BookOpen },
  { id: "calendar", name: "Kalender", icon: Calendar },
  { id: "folder-kanban", name: "Proyek", icon: FolderKanban },
  { id: "trending-up", name: "Grafik", icon: TrendingUp },
  { id: "wallet", name: "Keuangan", icon: Wallet },
  { id: "users", name: "Tim", icon: Users },
  { id: "home", name: "Beranda", icon: Home },
];

const CARD_ICON_PRESET_MAP: Record<string, CardIconComponent> = Object.fromEntries(
  CARD_ICON_PRESETS.map((p) => [p.id, p.icon])
);

export function getCardIconPresetById(iconId?: string): CardIconComponent | undefined {
  if (!iconId) return undefined;
  return CARD_ICON_PRESET_MAP[iconId];
}

export function getStoredCardIconImages(): Record<string, CardCustomIconValue> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CARD_ICON_IMAGES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredCardIconImages(
  images: Record<string, CardCustomIconValue>
): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(CARD_ICON_IMAGES_STORAGE_KEY, JSON.stringify(images));
    window.dispatchEvent(new Event(CARD_ICON_IMAGES_EVENT_KEY));
    return true;
  } catch (err) {
    console.error("Failed to save card icon images:", err);
    return false;
  }
}

/**
 * Resize & compress an uploaded image file into a compact square-friendly data URL
 * so it looks crisp inside circular card icons without overflowing localStorage.
 */
export function compressImageFileToDataUrl(file: File, maxSize = 192): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("File gambar kosong."));
        return;
      }

      // Preserve SVG directly when small
      if (file.type === "image/svg+xml" && result.length < 48000) {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("Format gambar tidak valid."));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, maxSize / Math.max(img.width || 1, img.height || 1));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(result);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const prefersPng = file.type === "image/png" || file.type === "image/webp";
          const dataUrl = prefersPng
            ? canvas.toDataURL("image/webp", 0.85)
            : canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        } catch {
          resolve(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export function useCardIconImage(title?: string, to?: string) {
  const [iconImages, setIconImages] = useState<Record<string, CardCustomIconValue>>(() =>
    getStoredCardIconImages()
  );

  useEffect(() => {
    const handler = () => {
      setIconImages(getStoredCardIconImages());
    };
    window.addEventListener(CARD_ICON_IMAGES_EVENT_KEY, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CARD_ICON_IMAGES_EVENT_KEY, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const cardKey = title || to || "";
  const customIcon =
    (title && iconImages[title]) ||
    (to && iconImages[to]) ||
    (cardKey && iconImages[cardKey]) ||
    undefined;

  const setPresetIcon = useCallback(
    (iconId: string) => {
      const next = { ...getStoredCardIconImages() };
      const value: CardCustomIconValue = { type: "preset", iconId };
      if (title) next[title] = value;
      if (to) next[to] = value;
      if (cardKey) next[cardKey] = value;
      return saveStoredCardIconImages(next);
    },
    [title, to, cardKey]
  );

  const setCustomImageSrc = useCallback(
    (src: string) => {
      const trimmed = src.trim();
      if (!trimmed) return false;
      const next = { ...getStoredCardIconImages() };
      const value: CardCustomIconValue = { type: "image", src: trimmed };
      if (title) next[title] = value;
      if (to) next[to] = value;
      if (cardKey) next[cardKey] = value;
      return saveStoredCardIconImages(next);
    },
    [title, to, cardKey]
  );

  const resetIconImage = useCallback(() => {
    const next = { ...getStoredCardIconImages() };
    if (title) delete next[title];
    if (to) delete next[to];
    if (cardKey) delete next[cardKey];
    saveStoredCardIconImages(next);
  }, [title, to, cardKey]);

  const customPresetIcon =
    customIcon?.type === "preset" ? getCardIconPresetById(customIcon.iconId) : undefined;
  const customImageSrc = customIcon?.type === "image" ? customIcon.src : undefined;

  return {
    customIcon,
    customPresetIcon,
    customImageSrc,
    hasCustomIcon: Boolean(customIcon),
    setPresetIcon,
    setCustomImageSrc,
    resetIconImage,
  };
}
