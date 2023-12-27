/* eslint-disable no-restricted-syntax */
class StringChecker {
    static check(props) {
        try {
            const viString = props.vi;
            const enString = props.en;
            const viResult = StringChecker.checkKeyAndValue(viString, enString);
            const enResult = StringChecker.checkKeyAndValue(enString, viString);
            StringChecker.showNotify([
                { lan: 'VI', result: viResult },
                { lan: 'EN', result: enResult },
            ]);
        } catch (error) {
            console.warn('Check language is error', error);
        }
    }

    static showNotify(array) {
        if (array) {
            for (const obj of array) {
                if (StringChecker.showAlert(obj.lan, obj.result)) {
                    return;
                }
            }
        }
    }

    static showAlert(lan, object) {
        if (
            object &&
            object.arrayKeyMissing &&
            object.arrayKeyMissing.length > 0
        ) {
            console.warn(
                `Language missing key in ${lan} `,
                object.arrayKeyMissing.toString(),
            );
            return true;
        }
        return false;
    }

    static checkKeyAndValue(array1, array2) {
        try {
            const arrayValue = [];
            const arrayValueDuplicate = [];
            const arrayKeyMissing = [];
            const arrayUnResolve = [];
            for (const key in array1) {
                if (!array2.hasOwnProperty(key)) {
                    arrayKeyMissing.push(JSON.stringify(key));
                } else {
                    if (arrayValue.indexOf(array1[key]) === -1) {
                        arrayValue.push(array1[key]);
                    } else {
                        arrayValueDuplicate.push(array1[key]);
                    }
                    if (array1[key] === array2[key]) {
                        arrayUnResolve.push(JSON.stringify(key));
                    }
                }
            }
            const result = {
                arrayKeyMissing,
                arrayValueDuplicate,
                arrayUnResolve,
            };
            return result;
        } catch (error) {
            console.warn('Check laguage is error', error);
        }
    }
}

export default StringChecker;
