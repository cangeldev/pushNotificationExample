import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NotificationListener, RequestUserPermission } from "./src/utils/pushNotificationHelper"
export default function App() {
  useEffect(() => {
    RequestUserPermission()
    NotificationListener()
  }, [])
  return (
    <View>
      <Text>App</Text>
    </View>
  )
}