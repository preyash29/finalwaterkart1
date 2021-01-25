import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { connect } from 'react-redux'
import { Circle } from 'react-native-progress'

class LoadingDialog extends React.Component {
  render () {
    const { rootLoader, rootLoaderTitle } = this.props
    return (
      <Modal
        isVisible={rootLoader}
        animationIn='fadeIn'
        animationOut='fadeOut'
        backdropOpacity={0.5}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={[styles.loaderContainer, rootLoaderTitle === '' && { alignSelf: 'center' }]}>
            <Circle
              size={45}
              indeterminate
              color={colors.white}
              borderWidth={3}
              endAngle={0.8}
            />
            {rootLoaderTitle !== '' && (<Text style={styles.titleTextStyle}>{rootLoaderTitle}</Text>)}
          </View>
        </View>

      </Modal>
    )
  }
}

function mapStateToProps ({ activityIndicator }) {
  return {
    rootLoader: activityIndicator.rootLoader,
    rootLoaderTitle: activityIndicator.rootLoaderTitle
  }
}

export default connect(mapStateToProps)(LoadingDialog)

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 25,
    borderRadius: 15,
    backgroundColor: colors.blueLight,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleTextStyle: {
    fontSize: 20,
    color: colors.black,
    marginLeft: 20,
    fontFamily: env.fontMedium
  }
})
