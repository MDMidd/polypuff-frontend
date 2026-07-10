/**
 * Permission Request Screen - Poly-Puff v2.0
 * =============================================
 * 
 * Google Play requires "prominent disclosure" before requesting
 * sensitive permissions. This screen explains WHY each permission
 * is needed before the system popup appears.
 * 
 * FILE: components/PermissionRequest.js
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Mic, Camera, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const PERMISSIONS = {
  microphone: {
    icon: Mic,
    title: 'Microphone Access',
    description: 'Poly-Puff needs your microphone to record your voice during speaking practice. Your voice audio is processed on-device and never stored or sent to third parties.',
    buttonText: 'Allow Microphone',
  },
  camera: {
    icon: Camera,
    title: 'Photo Library Access',
    description: 'Poly-Puff uses your photo library so you can set a profile picture. Your photos are only used for your profile and are stored locally on your device.',
    buttonText: 'Allow Photos',
  },
};

export default function PermissionRequest({ type, visible, onAllow, onDeny }) {
  const { colors: C } = useTheme();
  const perm = PERMISSIONS[type] || PERMISSIONS.microphone;
  const Icon = perm.icon;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDeny}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{
          backgroundColor: C.card, borderRadius: 20, padding: 28, width: '100%', maxWidth: 340,
          borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '30',
        }}>
          {/* Icon */}
          <View style={{
            width: 60, height: 60, borderRadius: 16, alignSelf: 'center', marginBottom: 16,
            backgroundColor: (C.cyan || '#00E5FF') + '15', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={28} color={C.cyan || '#00E5FF'} />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.text, textAlign: 'center', marginBottom: 8 }}>
            {perm.title}
          </Text>

          {/* Description - prominent disclosure */}
          <Text style={{ fontSize: 14, color: C.textSec, textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
            {perm.description}
          </Text>

          {/* Privacy note */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, backgroundColor: (C.amber || '#FFBE0B') + '10', padding: 12, borderRadius: 10 }}>
            <AlertCircle size={16} color={C.amber || '#FFBE0B'} style={{ marginTop: 2 }} />
            <Text style={{ fontSize: 12, color: C.textMuted, flex: 1, lineHeight: 18 }}>
              You can change this permission at any time in your phone's Settings.
            </Text>
          </View>

          {/* Allow button */}
          <TouchableOpacity
            onPress={onAllow}
            style={{
              backgroundColor: C.cyan || '#00E5FF', borderRadius: 12, paddingVertical: 14,
              alignItems: 'center', marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>{perm.buttonText}</Text>
          </TouchableOpacity>

          {/* Deny */}
          <TouchableOpacity onPress={onDeny} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.textMuted }}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
