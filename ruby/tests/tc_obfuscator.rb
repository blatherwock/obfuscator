require 'test/unit'
require '../obfuscator'
#
# Obfuscator tests.
#
class TestObfuscator < Test::Unit::TestCase
  #
  # Tests obfuscating the empty string.
  #
  def test_obfuscate_empty
    assert_equal('', Obfuscator.obfuscate(''))
  end
  #
  # Tests obfuscating a string.
  #
  def test_obfuscate
    str = 'test string'
    assert_not_equal(str, Obfuscator.obfuscate(str))
  end
  #
  # Tests obfuscating and then deobfuscating a string.
  #
  def test_obfuscate_deobfuscate
    str = 'test string ascii'
    assert_equal(str, Obfuscator.deobfuscate(Obfuscator.obfuscate(str)))

    str = "test string non-ascii \u0100"
    assert_equal(str, Obfuscator.deobfuscate(Obfuscator.obfuscate(str)))
  end
  #
  # Tests deobfuscating the empty sring.
  #
  def test_deobfuscate_empty
    assert_equal('', Obfuscator.deobfuscate(''))
  end
end
