/**
 * 本地协助人表单：负责输入、校验和提交 payload，不直接持久化数据。
 */
import React from 'react';

import { AppScreen } from '../../components';
import { useI18n } from '../../i18n';
import {
  MetaMutedText,
  PrimaryOnAccentLabel,
  ScreenTitleText
} from '../../theme';

import {
  HelperFormFieldCard,
  HelperFormInput,
  HelperNotesInput,
  HelperNoticeBlock,
  HelperSaveButton,
  HelperValidationText
} from './helper-form.styled';

export interface IHelperFormValues {
  displayName: string;
  relationship: string;
  contactMethod: string;
  notes: string;
}

export interface IHelperFormScreenCopy {
  title: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  relationshipLabel: string;
  relationshipPlaceholder: string;
  contactMethodLabel: string;
  contactMethodPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  localOnlyNotice: string;
  saveAction: string;
  displayNameRequired: string;
  contactMethodRequired: string;
}

export interface IHelperFormScreenProps {
  initialValues?: IHelperFormValues;
  onSubmit?: (values: IHelperFormValues) => void;
  copy?: IHelperFormScreenCopy;
}

export const HelperFormScreen = React.memo<IHelperFormScreenProps>(
  ({ initialValues, onSubmit, copy } = {}) => {
    const { getMessage } = useI18n();
    const [displayName, setDisplayName] = React.useState(
      initialValues?.displayName ?? ''
    );
    const [relationship, setRelationship] = React.useState(
      initialValues?.relationship ?? ''
    );
    const [contactMethod, setContactMethod] = React.useState(
      initialValues?.contactMethod ?? ''
    );
    const [notes, setNotes] = React.useState(initialValues?.notes ?? '');
    const [error, setError] = React.useState<
      'displayName' | 'contactMethod' | null
    >(null);

    React.useEffect(() => {
      setDisplayName(initialValues?.displayName ?? '');
      setRelationship(initialValues?.relationship ?? '');
      setContactMethod(initialValues?.contactMethod ?? '');
      setNotes(initialValues?.notes ?? '');
      setError(null);
    }, [
      initialValues?.contactMethod,
      initialValues?.displayName,
      initialValues?.notes,
      initialValues?.relationship
    ]);

    const handleSubmit = () => {
      const normalizedDisplayName = displayName.trim();
      const normalizedContactMethod = contactMethod.trim();

      if (!normalizedDisplayName) {
        setError('displayName');
        return;
      }

      if (!normalizedContactMethod) {
        setError('contactMethod');
        return;
      }

      setError(null);
      onSubmit?.({
        displayName: normalizedDisplayName,
        relationship: relationship.trim(),
        contactMethod: normalizedContactMethod,
        notes: notes.trim()
      });
    };

    return (
      <AppScreen>
        <ScreenTitleText>
          {copy?.title || getMessage('helpers.formTitle')}
        </ScreenTitleText>
        <HelperNoticeBlock>
          <MetaMutedText>
            {copy?.localOnlyNotice || getMessage('helpers.localOnlyNotice')}
          </MetaMutedText>
        </HelperNoticeBlock>
        <HelperFormFieldCard>
          <MetaMutedText>
            {copy?.displayNameLabel ||
              getMessage('helpers.displayNameLabel')}
          </MetaMutedText>
          <HelperFormInput
            placeholder={
              copy?.displayNamePlaceholder ||
              getMessage('helpers.displayNamePlaceholder')
            }
            value={displayName}
            onChangeText={setDisplayName}
          />
          {error === 'displayName' ? (
            <HelperValidationText>
              {copy?.displayNameRequired ||
                getMessage('helpers.displayNameRequired')}
            </HelperValidationText>
          ) : null}
        </HelperFormFieldCard>
        <HelperFormFieldCard>
          <MetaMutedText>
            {copy?.relationshipLabel ||
              getMessage('helpers.relationshipLabel')}
          </MetaMutedText>
          <HelperFormInput
            placeholder={
              copy?.relationshipPlaceholder ||
              getMessage('helpers.relationshipPlaceholder')
            }
            value={relationship}
            onChangeText={setRelationship}
          />
        </HelperFormFieldCard>
        <HelperFormFieldCard>
          <MetaMutedText>
            {copy?.contactMethodLabel ||
              getMessage('helpers.contactMethodLabel')}
          </MetaMutedText>
          <HelperFormInput
            placeholder={
              copy?.contactMethodPlaceholder ||
              getMessage('helpers.contactMethodPlaceholder')
            }
            value={contactMethod}
            onChangeText={setContactMethod}
          />
          {error === 'contactMethod' ? (
            <HelperValidationText>
              {copy?.contactMethodRequired ||
                getMessage('helpers.contactMethodRequired')}
            </HelperValidationText>
          ) : null}
        </HelperFormFieldCard>
        <HelperFormFieldCard>
          <MetaMutedText>
            {copy?.notesLabel || getMessage('helpers.notesLabel')}
          </MetaMutedText>
          <HelperNotesInput
            multiline
            placeholder={
              copy?.notesPlaceholder || getMessage('helpers.notesPlaceholder')
            }
            value={notes}
            onChangeText={setNotes}
          />
        </HelperFormFieldCard>
        <HelperSaveButton
          accessibilityRole="button"
          accessibilityLabel={
            copy?.saveAction || getMessage('helpers.saveAction')
          }
          onPress={handleSubmit}
        >
          <PrimaryOnAccentLabel>
            {copy?.saveAction || getMessage('helpers.saveAction')}
          </PrimaryOnAccentLabel>
        </HelperSaveButton>
      </AppScreen>
    );
  }
);

HelperFormScreen.displayName = 'HelperFormScreen';
