/* eslint-disable */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rule: {
    'type-enum': [
      '只能使用feat、fix、perf、refactor、BREAKING CHANGE',
      'always',
      [
        // 新增特性
        'feat',
        // bug修复
        'fix',
        // 代码优化、性能优化的递交，perfomance
        'perf',
        // 不涉及新增特性、bug修复的一般递交
        'refactor',
        // 破坏性提交，如重构时的一些提交
        'BREAKING CHANGE'
      ]
    ],
    'type-case': ['字母必须小写', 'always', 'lowerCase'],
    'type-empty': ['type不能为空', 'never'],
    'header-max-length': ['header长度不能超过72个字符', 'always', 72]
  }
};
