/**
 * Grammar Lessons Screen - Translation Trainer v6.2
 * ===================================================
 * 
 * Pulls all 193 grammar rules from the backend and displays them
 * as browseable lesson cards organized by category.
 * Students can search, filter by topic, and expand any rule
 * to see explanations, examples, and native language tips.
 * 
 * FILE: app/lessons.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BookOpen, Search, ChevronDown, ChevronRight, CheckCircle,
  XCircle, Globe, Filter,
} from 'lucide-react-native';
import { getRules } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function LessonsScreen() {
  const { colors: C } = useTheme();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState('Spanish');

  useEffect(() => {
    loadRules();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.nativeLanguage) setNativeLanguage(p.nativeLanguage);
      }
    } catch (e) {}
  };

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await getRules();
      setRules(data.rules || []);
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
    setLoading(false);
  };

  // Group by topic
  const topics = useMemo(() => {
    const grouped = {};
    for (const r of rules) {
      if (!grouped[r.topic]) grouped[r.topic] = [];
      grouped[r.topic].push(r);
    }
    return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  }, [rules]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    let filtered = rules;
    if (selectedTopic) filtered = filtered.filter(r => r.topic === selectedTopic);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.rule_id?.toLowerCase().includes(q) ||
        r.topic?.toLowerCase().includes(q) ||
        r.sub_topic?.toLowerCase().includes(q) ||
        r.feedback_template?.explanation?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [rules, selectedTopic, search]);

  const priorityLabel = (p) => p === 1 ? 'Critical' : p === 2 ? 'Important' : 'Advanced';
  const priorityColor = (p) => p === 1 ? C.red : p === 2 ? C.amber : C.blue;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.blue} />
        <Text style={{ color: C.textSec, marginTop: 12 }}>Loading grammar rules...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Header */}
        <Text style={{ fontSize: 26, fontWeight: '800', color: C.text, marginTop: 10 }}>Grammar Lessons</Text>
        <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2, marginBottom: 16 }}>
          {rules.length} rules • {topics.length} categories • Tips in {nativeLanguage}
        </Text>

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: C.border + '30' }}>
          <Search size={18} color={C.textMuted} />
          <TextInput
            style={{ flex: 1, padding: 12, fontSize: 15, color: C.text }}
            placeholder="Search rules..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Topic pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: !selectedTopic ? C.emerald + '20' : C.card, marginRight: 8, borderWidth: 1, borderColor: !selectedTopic ? C.emerald : C.border + '30' }}
            onPress={() => setSelectedTopic(null)}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: !selectedTopic ? C.emeraldLight : C.textMuted }}>All ({rules.length})</Text>
          </TouchableOpacity>
          {topics.map(([topic, topicRules]) => (
            <TouchableOpacity
              key={topic}
              style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: selectedTopic === topic ? C.blue + '20' : C.card, marginRight: 8, borderWidth: 1, borderColor: selectedTopic === topic ? C.blue : C.border + '30' }}
              onPress={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: selectedTopic === topic ? C.blueLight : C.textMuted }}>{topic} ({topicRules.length})</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rules list */}
        {filteredRules.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Filter size={32} color={C.textMuted} />
            <Text style={{ fontSize: 16, color: C.textMuted, marginTop: 12 }}>No rules match your search</Text>
          </View>
        ) : (
          filteredRules.map(rule => {
            const isExpanded = expandedRule === rule.rule_id;
            const fb = rule.feedback_template || {};
            const translation = fb.translations?.[nativeLanguage];
            return (
              <TouchableOpacity
                key={rule.rule_id}
                style={{
                  backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 8,
                  borderWidth: 1, borderColor: isExpanded ? C.blue + '40' : C.border + '20',
                }}
                onPress={() => setExpandedRule(isExpanded ? null : rule.rule_id)}
                activeOpacity={0.7}
              >
                {/* Header row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ backgroundColor: priorityColor(rule.priority_level) + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: priorityColor(rule.priority_level) }}>
                      {rule.rule_id}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{rule.sub_topic || rule.topic}</Text>
                    <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{rule.topic} • P{rule.priority_level} {priorityLabel(rule.priority_level)}</Text>
                  </View>
                  {isExpanded ? <ChevronDown size={18} color={C.textMuted} /> : <ChevronRight size={18} color={C.textMuted} />}
                </View>

                {/* Expanded content */}
                {isExpanded && (
                  <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.border + '20' }}>
                    {/* Explanation */}
                    {fb.explanation && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSec, marginBottom: 4 }}>📖 Rule</Text>
                        <Text style={{ fontSize: 14, color: C.text, lineHeight: 21 }}>{fb.explanation}</Text>
                      </View>
                    )}

                    {/* Correct example */}
                    {fb.correct_example && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSec, marginBottom: 4 }}>✅ Correct</Text>
                        <View style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: C.emerald }}>
                          <Text style={{ fontSize: 14, color: C.emeraldLight }}>{fb.correct_example}</Text>
                        </View>
                      </View>
                    )}

                    {/* Incorrect example */}
                    {fb.incorrect_example && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSec, marginBottom: 4 }}>❌ Incorrect</Text>
                        <View style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: C.red }}>
                          <Text style={{ fontSize: 14, color: C.redLight || '#FCA5A5', textDecorationLine: 'line-through' }}>{fb.incorrect_example}</Text>
                        </View>
                      </View>
                    )}

                    {/* Native language tip */}
                    {translation && (
                      <View style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSec, marginBottom: 4 }}>🌍 In {nativeLanguage}</Text>
                        <View style={{ backgroundColor: C.cardAlt, borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: C.blue }}>
                          <Text style={{ fontSize: 14, color: C.blueLight, lineHeight: 20 }}>{translation}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
