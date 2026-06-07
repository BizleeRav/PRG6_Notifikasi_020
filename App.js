import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [reminderTime, setReminderTime] = useState('22:00');
  const [savedTime, setSavedTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const deathTitles = [
    '☠️ Death Reminder',
    '⏳ Memento Mori',
    '⚰️ Life Reminder',
    '🕰️ Time Is Running',
    '📖 Chapter of Life',
  ];

  const deathQuotes = [
    'Suatu hari kamu akan mati. Gunakan waktumu hari ini dengan baik.',
    'Hari ini umurmu berkurang satu hari.',
    'Jika hari ini adalah hari terakhirmu, apa yang akan kamu lakukan?',
    'Waktu terus berjalan dan tidak bisa diputar kembali.',
    'Jangan menunda mimpi yang bisa dimulai hari ini.',
    'Setiap detik yang berlalu tidak akan kembali.',
    'Hidup itu terbatas, manfaatkan kesempatan yang ada.',
    'Apakah hari ini sudah lebih baik dari kemarin?',
    'Kematian pasti datang, tetapi penyesalan bisa dicegah.',
    'Lakukan sesuatu yang membuat hidupmu berarti hari ini.',
    'Fokus pada hal yang penting sebelum waktu habis.',
    'Daftar mimpimu lebih panjang daripada waktumu.',
    'Besok bukan janji, hanya kemungkinan.',
    'Waktu adalah mata uang yang tidak bisa diisi ulang.',
    'Apa yang kamu tunda hari ini mungkin tidak sempat kamu lakukan besok.',
    'Kamu sudah scroll berapa jam hari ini?',
    'Apakah target hidupmu lebih besar daripada target rank game?',
    'Waktu hidupmu berkurang bahkan saat membaca notifikasi ini.',
    'Versi dirimu 10 tahun lagi sedang dibentuk oleh keputusan hari ini.',
    'Kalau bukan sekarang, kapan lagi?',
  ];

  useEffect(() => {
    registerForPushNotificationsAsync();

    const timer = setInterval(() => {
      const now = new Date();

      const time =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0') +
        ':' +
        now.getSeconds().toString().padStart(2, '0');

      setCurrentTime(time);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const saveReminder = async () => {
    try {
      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Izin Ditolak',
          'Aktifkan izin notifikasi terlebih dahulu'
        );
        return;
      }

      setSavedTime(reminderTime);

      const now = new Date();

      const [hour, minute] =
        reminderTime.split(':');

      const reminderDate = new Date();

      reminderDate.setHours(
        parseInt(hour),
        parseInt(minute),
        0,
        0
      );

      if (reminderDate <= now) {
        reminderDate.setDate(
          reminderDate.getDate() + 1
        );
      }

      const seconds = Math.floor(
        (reminderDate.getTime() - now.getTime()) /
          1000
      );

      const randomTitle =
        deathTitles[
          Math.floor(
            Math.random() * deathTitles.length
          )
        ];

      const randomQuote =
        deathQuotes[
          Math.floor(
            Math.random() * deathQuotes.length
          )
        ];

      const notificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: randomTitle,
            body: randomQuote,
          },
          trigger: {
            type:
              Notifications.SchedulableTriggerInputTypes
                .TIME_INTERVAL,
            seconds,
          },
        });

      console.log(
        'NOTIFICATION ID:',
        notificationId
      );

      Alert.alert(
        'Reminder Disimpan',
        `Death Reminder dijadwalkan pada pukul ${reminderTime}`
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.toString());
    }
  };

  const testNotification = async () => {
    try {
      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Izin Ditolak',
          'Aktifkan izin notifikasi terlebih dahulu'
        );
        return;
      }

      const randomTitle =
        deathTitles[
          Math.floor(
            Math.random() * deathTitles.length
          )
        ];

      const randomQuote =
        deathQuotes[
          Math.floor(
            Math.random() * deathQuotes.length
          )
        ];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: randomTitle,
          body: randomQuote,
        },
        trigger: null,
      });

      Alert.alert(
        'Tes Berhasil',
        'Notifikasi berhasil dikirim'
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.toString());
    }
  };

  const resetReminder = () => {
    setSavedTime('');

    Alert.alert(
      'Reminder Direset',
      'Death Reminder berhasil dihapus'
    );
  };

  async function registerForPushNotificationsAsync() {
    try {
      if (!Device.isDevice) {
        Alert.alert(
          'Error',
          'Harus menggunakan HP fisik'
        );
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } =
          await Notifications.requestPermissionsAsync();

        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Error',
          'Izin notifikasi ditolak'
        );
        return;
      }

      const token =
        await Notifications.getDevicePushTokenAsync();

      console.log(
        'FCM TOKEN:',
        token.data
      );

      Alert.alert(
        'FCM TOKEN',
        token.data
      );

      return token.data;
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error.toString()
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.skull}>☠️</Text>

      <Text style={styles.title}>
        Death Reminder
      </Text>

      <Text style={styles.subtitle}>
        Ingat bahwa waktu hidup terbatas,
        gunakan setiap hari dengan lebih bermakna.
      </Text>

      <View style={styles.timeCard}>
        <Text style={styles.timeTitle}>
          🕒 Waktu Saat Ini
        </Text>

        <Text style={styles.timeText}>
          {currentTime}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Pilih Waktu Renungan
        </Text>

        <Picker
          selectedValue={reminderTime}
          onValueChange={(itemValue) =>
            setReminderTime(itemValue)
          }
          dropdownIconColor="#FFFFFF"
          style={styles.picker}
        >
          <Picker.Item label="08:00" value="08:00" />
          <Picker.Item label="12:00" value="12:00" />
          <Picker.Item label="18:00" value="18:00" />
          <Picker.Item label="21:00" value="21:00" />
        </Picker>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          Status Reminder
        </Text>

        <Text style={styles.statusText}>
          {savedTime
            ? `Death Reminder aktif pukul ${savedTime}`
            : 'Belum ada Death Reminder yang disimpan'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={saveReminder}
      >
        <Text style={styles.buttonText}>
          Simpan Reminder
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testNotification}
      >
        <Text style={styles.buttonText}>
          Tes Notifikasi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetReminder}
      >
        <Text style={styles.buttonText}>
          Reset Reminder
        </Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  skull: {
    fontSize: 90,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: 16,
    marginBottom: 20,
  },

  timeCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  timeTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  timeText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },

  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  picker: {
    color: '#FFFFFF',
  },

  statusCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },

  statusTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  statusText: {
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 15,
  },

  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },

  testButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },

  resetButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});