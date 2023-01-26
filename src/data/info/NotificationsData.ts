import {Notification} from '../enums/Notification';

export type NotificationContent = {
    header: string;
    description: string;
}

export type ExportFormatDataMap = Record<Notification, NotificationContent>;

export const NotificationsDataMap = {
    [Notification.SUCCESSFUL_EXPORTED_ANNOTATION]: {
        header: 'Successfully exported annotation to database',
        description: ''
    },
    [Notification.EMPTY_LABEL_NAME_ERROR]: {
        header: 'Empty label name',
        description: "Looks like you didn't assign name to one of your labels. Unfortunately it is mandatory for " +
          'every label to have unique name value. Insert correct name or delete empty label and try again.'
    },
    [Notification.NON_UNIQUE_LABEL_NAMES_ERROR]: {
        header: 'Non unique label names',
        description: 'Looks like not all your label names are unique. Unique names are necessary to guarantee correct' +
            ' data export when you complete your work. Make your names unique and try again.'
    },
    [Notification.UNSUCCESSFUL_EXPORTED_ANNOTATION]: {
        header: 'Unsuccessfully exported annotation to database',
        description: 'Select label type and the file format you would like to use to export labels.'
    },
    [Notification.IMAGE_STATUS_CHANGED_APPROVED]: {
        header: 'Successfully changed image status to APPROVED',
        description: ''
    },
    [Notification.IMAGE_STATUS_CHANGED_REJECTED]: {
        header: 'Successfully changed image status to REJECTED',
        description: ''
    },
    [Notification.UNSUCCESSFULLY_CHANGED_STATUS]: {
        header: 'Unsuccessfully changed image status',
        description: ''
    }
}
