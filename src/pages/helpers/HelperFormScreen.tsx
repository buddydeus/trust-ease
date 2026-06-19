/**
 * 本地协助人表单：负责输入、校验和提交 payload，不直接持久化数据。
 */
import { memo, useEffect, useState } from 'react';

import { AppScreen, BackButton } from '../../components';
import { useI18n } from '../../i18n';
import {
  CardTitleText,
  MetaMutedText,
  PrimaryOnAccentLabel,
  ScreenTitleText
} from '../../theme';

import {
  HelperChoiceButton,
  HelperChoiceList,
  HelperChoiceToggle,
  HelperContactActionButton,
  HelperContactActionRow,
  HelperContactInput,
  HelperContactMethodItem,
  HelperContactMethodBlock,
  HelperContactMethodRow,
  HelperContactTypeButton,
  HelperContactTypeCaretText,
  HelperContactTypeIconText,
  HelperContactTypeMenu,
  HelperFormFieldCard,
  HelperFormInput,
  HelperNotesInput,
  HelperNoticeBlock,
  HelperSaveButton,
  HelperValidationText
} from './helper-form.styled';

export interface IHelperFormContactMethod {
  type: string;
  value: string;
}

export interface IHelperFormValues {
  displayName: string;
  relationship: string;
  contactMethod: string;
  contactMethods?: IHelperFormContactMethod[];
  notes: string;
}

export interface IHelperContactTypeOption {
  type: string;
  label: string;
}

export interface IHelperFormScreenCopy {
  title: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  relationshipLabel: string;
  relationshipPlaceholder: string;
  relationshipOptions?: string[];
  relationshipSelectPlaceholder?: string;
  contactMethodLabel: string;
  contactMethodPlaceholder: string;
  contactMethodTypes?: IHelperContactTypeOption[];
  addContactMethodAction?: string;
  removeContactMethodAction?: string;
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
  onBack?: () => void;
  copy?: IHelperFormScreenCopy;
}

const defaultRelationshipOptions = ['家人', '朋友', '信任', '特殊'];
const defaultContactMethodTypes: IHelperContactTypeOption[] = [
  { type: 'phone', label: '电话' },
  { type: 'email', label: '邮箱' }
];

const getContactTypeIcon = (type: string): string => {
  if (type === 'email') {
    return '@';
  }

  return '☎';
};

const splitLegacyContactMethod = (value: string): IHelperFormContactMethod => {
  const normalizedValue = value.trim();
  const separatorIndex = normalizedValue.indexOf(':');

  if (separatorIndex > 0) {
    return {
      type: normalizedValue.slice(0, separatorIndex),
      value: normalizedValue.slice(separatorIndex + 1)
    };
  }

  return {
    type: normalizedValue.includes('@') ? 'email' : 'phone',
    value: normalizedValue
  };
};

const createInitialContactMethods = (
  initialValues?: IHelperFormValues
): IHelperFormContactMethod[] => {
  if (initialValues?.contactMethods?.length) {
    return initialValues.contactMethods.map(method => ({
      type: method.type || 'phone',
      value: method.value
    }));
  }

  if (initialValues?.contactMethod) {
    return [splitLegacyContactMethod(initialValues.contactMethod)];
  }

  return [{ type: 'phone', value: '' }];
};

const buildPrimaryContactMethod = (
  methods: IHelperFormContactMethod[]
): string => {
  const firstMethod = methods.find(method => method.value.trim().length > 0);

  if (!firstMethod) {
    return '';
  }

  const normalizedValue = firstMethod.value.trim();
  const separatorIndex = normalizedValue.indexOf(':');

  if (separatorIndex > 0) {
    const prefix = normalizedValue.slice(0, separatorIndex);

    if (prefix === firstMethod.type) {
      return normalizedValue;
    }
  }

  return `${firstMethod.type.trim() || 'phone'}:${normalizedValue}`;
};

const trimContactMethodValue = (type: string, value: string): string => {
  const normalizedType = type.trim() || 'phone';
  const normalizedValue = value.trim();
  const separatorIndex = normalizedValue.indexOf(':');

  if (separatorIndex > 0) {
    const prefix = normalizedValue.slice(0, separatorIndex);

    if (prefix === normalizedType) {
      return normalizedValue.slice(separatorIndex + 1).trim();
    }
  }

  return normalizedValue;
};

export const HelperFormScreen = memo<IHelperFormScreenProps>(
  ({ initialValues, onSubmit, onBack, copy } = {}) => {
    const { getMessage } = useI18n();
    const [displayName, setDisplayName] = useState(
      initialValues?.displayName ?? ''
    );
    const [relationship, setRelationship] = useState(
      initialValues?.relationship ?? ''
    );
    const [relationshipOptionsVisible, setRelationshipOptionsVisible] =
      useState(false);
    const [contactMethods, setContactMethods] = useState(
      createInitialContactMethods(initialValues)
    );
    const [openContactTypeIndex, setOpenContactTypeIndex] = useState<
      number | null
    >(null);
    const [notes, setNotes] = useState(initialValues?.notes ?? '');
    const [error, setError] = useState<'displayName' | 'contactMethod' | null>(
      null
    );
    const relationshipOptions =
      copy?.relationshipOptions || defaultRelationshipOptions;
    const contactMethodTypes =
      copy?.contactMethodTypes || defaultContactMethodTypes;

    useEffect(() => {
      setDisplayName(initialValues?.displayName ?? '');
      setRelationship(initialValues?.relationship ?? '');
      setRelationshipOptionsVisible(false);
      setContactMethods(createInitialContactMethods(initialValues));
      setOpenContactTypeIndex(null);
      setNotes(initialValues?.notes ?? '');
      setError(null);
    }, [
      initialValues?.contactMethod,
      initialValues?.contactMethods,
      initialValues?.displayName,
      initialValues?.notes,
      initialValues?.relationship
    ]);

    const updateContactMethod = (
      index: number,
      values: Partial<IHelperFormContactMethod>
    ) => {
      setContactMethods(currentMethods =>
        currentMethods.map((method, currentIndex) =>
          currentIndex === index ? { ...method, ...values } : method
        )
      );
    };

    const addContactMethod = () => {
      setContactMethods(currentMethods => [
        ...currentMethods,
        { type: 'phone', value: '' }
      ]);
      setOpenContactTypeIndex(null);
    };

    const removeContactMethod = (index: number) => {
      setContactMethods(currentMethods =>
        currentMethods.length === 1
          ? currentMethods
          : currentMethods.filter((_, currentIndex) => currentIndex !== index)
      );
      setOpenContactTypeIndex(null);
    };

    const handleSubmit = () => {
      const normalizedDisplayName = displayName.trim();
      const normalizedContactMethods = contactMethods
        .map(method => ({
          type: method.type.trim() || 'phone',
          value: trimContactMethodValue(method.type, method.value)
        }))
        .filter(method => method.value.length > 0);
      const normalizedContactMethod = buildPrimaryContactMethod(
        normalizedContactMethods
      );

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
        contactMethods: normalizedContactMethods,
        notes: notes.trim()
      });
    };

    return (
      <AppScreen>
        {onBack ? <BackButton onPress={onBack} /> : null}
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
            {copy?.displayNameLabel || getMessage('helpers.displayNameLabel')}
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
            {copy?.relationshipLabel || getMessage('helpers.relationshipLabel')}
          </MetaMutedText>
          <HelperChoiceToggle
            accessibilityRole="button"
            accessibilityLabel={
              copy?.relationshipSelectPlaceholder ||
              getMessage('helpers.relationshipSelectPlaceholder')
            }
            onPress={() =>
              setRelationshipOptionsVisible(currentVisible => !currentVisible)
            }
          >
            <CardTitleText>
              {relationship ||
                copy?.relationshipSelectPlaceholder ||
                getMessage('helpers.relationshipSelectPlaceholder')}
            </CardTitleText>
          </HelperChoiceToggle>
          {relationshipOptionsVisible ? (
            <HelperChoiceList>
              {relationshipOptions.map(option => (
                <HelperChoiceButton
                  accessibilityRole="button"
                  key={option}
                  selected={relationship === option}
                  onPress={() => {
                    setRelationship(option);
                    setRelationshipOptionsVisible(false);
                  }}
                >
                  <MetaMutedText>{option}</MetaMutedText>
                </HelperChoiceButton>
              ))}
            </HelperChoiceList>
          ) : null}
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
          <HelperContactMethodBlock>
            {contactMethods.map((method, index) => (
              <HelperContactMethodItem key={`${index}-${method.type}`}>
                <HelperContactMethodRow>
                  <HelperContactTypeButton
                    accessibilityRole="button"
                    accessibilityLabel={
                      contactMethodTypes.find(
                        typeOption => typeOption.type === method.type
                      )?.label || method.type
                    }
                    selected
                    onPress={() =>
                      setOpenContactTypeIndex(currentIndex =>
                        currentIndex === index ? null : index
                      )
                    }
                  >
                    <HelperContactTypeIconText>
                      {getContactTypeIcon(method.type)}
                    </HelperContactTypeIconText>
                    <HelperContactTypeCaretText>⌄</HelperContactTypeCaretText>
                  </HelperContactTypeButton>
                  <HelperContactInput
                    placeholder={
                      copy?.contactMethodPlaceholder ||
                      getMessage('helpers.contactMethodPlaceholder')
                    }
                    value={method.value}
                    onChangeText={value =>
                      updateContactMethod(index, { value })
                    }
                  />
                  {contactMethods.length > 1 ? (
                    <HelperContactActionButton
                      accessibilityRole="button"
                      onPress={() => removeContactMethod(index)}
                    >
                      <MetaMutedText>
                        {copy?.removeContactMethodAction ||
                          getMessage('helpers.removeContactMethodAction')}
                      </MetaMutedText>
                    </HelperContactActionButton>
                  ) : null}
                </HelperContactMethodRow>
                {openContactTypeIndex === index ? (
                  <HelperContactTypeMenu>
                    {contactMethodTypes.map(typeOption => (
                      <HelperContactTypeButton
                        accessibilityRole="button"
                        accessibilityLabel={typeOption.label}
                        key={typeOption.type}
                        selected={method.type === typeOption.type}
                        onPress={() => {
                          updateContactMethod(index, {
                            type: typeOption.type
                          });
                          setOpenContactTypeIndex(null);
                        }}
                      >
                        <MetaMutedText>{typeOption.label}</MetaMutedText>
                      </HelperContactTypeButton>
                    ))}
                  </HelperContactTypeMenu>
                ) : null}
              </HelperContactMethodItem>
            ))}
          </HelperContactMethodBlock>
          <HelperContactActionRow>
            <HelperContactActionButton
              accessibilityRole="button"
              onPress={addContactMethod}
            >
              <MetaMutedText>
                {copy?.addContactMethodAction ||
                  getMessage('helpers.addContactMethodAction')}
              </MetaMutedText>
            </HelperContactActionButton>
          </HelperContactActionRow>
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
