require 'Base64'

#
# Obfuscator.
#
# This class provides methods to obfuscate and deobfuscate textual strings. The
# obfuscation is not intended to provide any real security, just to prevent
# casual reading by humans and machines.
# 
# Authors: John Peloquin and Joseph Baker
# Copyright: Copyright (c) 2012 John Peloquin and Joseph Baker. All rights reserved.
#
class Obfuscator
  #
  # Inverts a string of bytes.
  #
  def self.invert(str)
    out = ''
    str.each_byte do |b| out << (~b & 0xff) end
    out
  end

  #
  # Encodes a string of bytes to base64 (RFC 4648).
  #
  def self.encode64(str)
    return Base64.strict_encode64(str)
  end

  #
  # Decodes a string of bytes from base64 (RFC 4648).
  #
  def self.decode64(str)
    return Base64.strict_decode64(str)
  end

  #
  # Obfuscates a string of text.
  #
  # This method obfuscates the input string by base64 encoding inversions of the
  # bytes in the utf8 representation of the string.
  #
  def self.obfuscate(str)
    encode64(invert(str.encode('utf-8')))
  end

  #
  # Deobfuscates a string of obfuscated text.
  #
  # The returned string is utf8 encoded.
  #
  def self.deobfuscate(str)
    invert(decode64(str)).force_encoding('utf-8')
  end

  private_class_method :invert, :encode64, :decode64
end
