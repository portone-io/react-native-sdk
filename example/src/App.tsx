import { Alert, SafeAreaView, StyleSheet } from 'react-native'
import { Payment } from '@portone/react-native-sdk'

export default function App() {
  return (
    <SafeAreaView style={style.container}>
      <Payment
        request={{
          storeId: 'stordId',
          paymentId: 'paymentId',
          orderName: 'orderName',
          totalAmount: 1000,
          currency: 'CURRENCY_KRW',
          channelKey: 'channelKey',
          productType: 'PRODUCT_TYPE_DIGITAL',
          payMethod: 'CARD',
        }}
        onComplete={(response) =>
          Alert.alert('Complete', JSON.stringify(response))
        }
        onError={(error) => Alert.alert('Error', error.message)}
      />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
})
