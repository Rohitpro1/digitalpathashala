import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useOffline } from '../../hooks/useOffline';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { LanguageSelector } from '../../components/LanguageSelector';
import { OfflineIndicator } from '../../components/OfflineIndicator';
import { lessonsAPI, modulesAPI, assignmentsAPI } from '../../services/api';
import { saveLessons, saveModules, saveAssignments, getLessons, getModules, getAssignments } from '../../services/storage';
import { COLORS, SPACING, FONTS } from '../../constants/colors';

export default function StudentDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { isOffline } = useOffline();
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isOffline) {
        // Load from offline storage
        const [offlineLessons, offlineModules, offlineAssignments] = await Promise.all([
          getLessons(),
          getModules(),
          getAssignments(),
        ]);
        setLessons(offlineLessons || []);
        setModules(offlineModules || []);
        setAssignments(offlineAssignments || []);
      } else {
        // Fetch from API
        const [lessonsRes, modulesRes, assignmentsRes] = await Promise.all([
          lessonsAPI.getAll(),
          modulesAPI.getAll(),
          assignmentsAPI.getAll(),
        ]);

        setLessons(lessonsRes.data);
        setModules(modulesRes.data);
        setAssignments(assignmentsRes.data);

        // Save to offline storage
        await saveLessons(lessonsRes.data);
        await saveModules(modulesRes.data);
        await saveAssignments(assignmentsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Digital Pathshala</Text>
          <Text style={styles.headerSubtitle}>Welcome, {user.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <LanguageSelector />
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Lessons Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{t.lessons}</Text>
          </View>
          {lessons.slice(0, 3).map((lesson) => (
            <Card
              key={lesson.id}
              onPress={() => navigation.navigate('LessonViewer', { lesson })}
              style={styles.card}
            >
              <CardHeader
                title={lesson.title?.english || lesson.title}
                subtitle={`${lesson.subject} • ${lesson.grade}`}
              />
              <CardContent>
                <Button
                  title={t.startLesson}
                  size="small"
                  onPress={() => navigation.navigate('LessonViewer', { lesson })}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            title="View All Lessons"
            variant="outline"
            onPress={() => navigation.navigate('LessonsList')}
          />
        </View>

        {/* Digital Literacy Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>{t.digitalLiteracy}</Text>
          </View>
          {modules.slice(0, 3).map((module) => (
            <Card
              key={module.id}
              onPress={() => navigation.navigate('ModuleViewer', { module })}
              style={styles.card}
            >
              <CardHeader
                title={module.title?.english || module.title}
                subtitle={`${module.level} • ${module.category}`}
              />
              <CardContent>
                <Button
                  title={t.startLesson}
                  size="small"
                  variant="secondary"
                  onPress={() => navigation.navigate('ModuleViewer', { module })}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            title="View All Modules"
            variant="outline"
            onPress={() => navigation.navigate('ModulesList')}
          />
        </View>

        {/* Assignments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>{t.assignments}</Text>
          </View>
          {assignments.length === 0 ? (
            <Card>
              <CardContent>
                <Text style={styles.emptyText}>No assignments yet</Text>
              </CardContent>
            </Card>
          ) : (
            assignments.slice(0, 3).map((assignment) => (
              <Card key={assignment.id} style={styles.card}>
                <CardHeader
                  title={assignment.title}
                  subtitle={`Due: ${new Date(assignment.due_date).toLocaleDateString()}`}
                />
                <CardContent>
                  <Button
                    title={t.view}
                    size="small"
                    variant="secondary"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <OfflineIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoutButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  card: {
    marginBottom: SPACING.md,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.base,
    padding: SPACING.lg,
  },
});
