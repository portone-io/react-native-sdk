import { Alert, StyleSheet, View } from 'react-native'
import { Payment } from '@portone/react-native-sdk'

export default function App() {
  return (
    <View style={styles.container}>
      <Payment
        request={{
          storeId: 'storeId',
          channelKey: 'channelKey',
          paymentId: 'paymentId',
          orderName: 'orderName',
          totalAmount: 1000,
          currency: 'CURRENCY_KRW',
          payMethod: 'CARD',
        }}
        onComplete={(response) =>
          Alert.alert('Complete', JSON.stringify(response))
        }
        onError={(error) => Alert.alert('Error', error.message)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
