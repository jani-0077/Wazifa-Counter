import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Trash2, Clock } from 'lucide-react-native';
import { SessionSummary } from '@/types/session';

const { width } = Dimensions.get('window');
const cardWidth = width > 768 ? (width - 60) / 2 : width - 40;

interface SessionCardProps {
  session: SessionSummary;
  onPress: () => void;
  onDelete: () => void;
}

export default function SessionCard({ session, onPress, onDelete }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sessionName} numberOfLines={1}>
            {session.name}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.countContainer}>
        <Text style={styles.countLabel}>Count</Text>
        <Text style={styles.countValue}>{session.count}</Text>
      </View>
      
      <View style={styles.dateContainer}>
        <Clock size={12} color="#9ca3af" />
        <Text style={styles.dateText}>{formatDate(session.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  countContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'monospace',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
});